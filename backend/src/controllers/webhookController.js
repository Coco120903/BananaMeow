import Stripe from "stripe";
import Order from "../models/Order.js";
import Donation from "../models/Donation.js";
import Product from "../models/Product.js";
import { sendOrderConfirmationEmail, sendDonationThankYouEmail } from "../utils/emailService.js";

function getStripeClient() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey || !stripeSecretKey.trim()) {
    throw new Error("STRIPE_SECRET_KEY is missing");
  }
  return new Stripe(stripeSecretKey);
}

// @desc    Handle Stripe webhook events
// @route   POST /api/webhooks/stripe
export async function handleStripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret) {
      const stripe = getStripeClient();
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // In development without webhook secret, parse the body directly
      event = JSON.parse(req.body.toString());
      console.warn("Stripe webhook secret not configured — accepting unverified event");
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await handleCheckoutComplete(session);
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object;
        await handleCheckoutExpired(session);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        await handleRefund(charge);
        break;
      }
      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: "Webhook processing error" });
  }
}

async function handleCheckoutComplete(session) {
  const stripeSessionId = session.id;

  // Try to find an Order with this session
  const order = await Order.findOne({ stripeSessionId });
  if (order && order.status === "pending") {
    order.status = "paid";
    order.email = order.email || session.customer_email || session.customer_details?.email;
    await order.save();

    // Decrement inventory for each item (atomic operation)
    for (const item of order.items) {
      if (item.productId) {
        // Use atomic update to prevent race conditions
        const result = await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { inventory: -item.quantity } },
          { new: true }
        );
        
        // Verify stock didn't go negative (safety check)
        if (result && result.inventory < 0) {
          console.warn(`⚠️ Stock went negative for product ${item.productId} (${result.inventory}). This should not happen.`);
          // Restore the stock to prevent negative inventory
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { inventory: item.quantity }
          });
        }
      }
    }

    // Send confirmation email
    if (order.email) {
      await sendOrderConfirmationEmail(order.email, order);
    }

    console.log(`Order ${order._id} marked as paid`);
    return;
  }

  // Try to find a Donation with this session
  const donation = await Donation.findOne({ stripeSessionId });
  if (donation && donation.status === "pending") {
    donation.status = "completed";
    donation.email = donation.email || session.customer_email || session.customer_details?.email;
    await donation.save();

    // Send thank you email
    if (donation.email) {
      await sendDonationThankYouEmail(donation.email, donation);
    }

    console.log(`Donation ${donation._id} marked as completed`);
  }
}

async function handleCheckoutExpired(session) {
  const stripeSessionId = session.id;

  // Mark order as expired
  await Order.findOneAndUpdate(
    { stripeSessionId, status: "pending" },
    { status: "expired" }
  );

  // Mark donation as expired
  await Donation.findOneAndUpdate(
    { stripeSessionId, status: "pending" },
    { status: "expired" }
  );
}

async function handleRefund(charge) {
  // Find order by stripe payment intent or session
  const order = await Order.findOne({
    status: "paid",
    stripeSessionId: { $exists: true }
  });

  if (order) {
    order.status = "refunded";
    await order.save();
    console.log(`Order ${order._id} marked as refunded`);
  }
}
