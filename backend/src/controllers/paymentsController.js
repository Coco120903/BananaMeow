import Stripe from "stripe";
import Donation from "../models/Donation.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderReceipt, sendDonationReceipt } from "../utils/emailService.js";

function getStripeClient() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey || !stripeSecretKey.trim()) {
    const error = new Error(
      "STRIPE_SECRET_KEY is missing. Set it in backend/.env and restart the server."
    );
    error.statusCode = 500;
    throw error;
  }

  return new Stripe(stripeSecretKey);
}

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

export async function createDonationCheckout(req, res) {
  const { amount, frequency, type, cat } = req.body;

  try {
    const stripe = getStripeClient();
    const normalizedFrequency =
      frequency === "monthly" ? "monthly" : "one-time";
    const isSubscription = normalizedFrequency === "monthly";
    const unitAmount = Math.round(Number(amount) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Banana Meow Donation: ${type}`,
              description: `${normalizedFrequency} support for ${cat}`
            },
            unit_amount: unitAmount,
            ...(isSubscription
              ? {
                  recurring: {
                    interval: "month"
                  }
                }
              : {})
          },
          quantity: 1
        }
      ],
      success_url: `${frontendUrl}/donate?success=true`,
      cancel_url: `${frontendUrl}/donate?canceled=true`
    });

    await Donation.create({
      amount,
      frequency: normalizedFrequency,
      type,
      cat,
      stripeSessionId: session.id
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe donation error:", error);
    res.status(500).json({ message: "Unable to start donation checkout" });
  }
}

export async function createOrderCheckout(req, res) {
  const { items, email } = req.body;

  try {
    const stripe = getStripeClient();

    // Validate inventory before creating checkout
    for (const item of items) {
      if (item.productId) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Product "${item.name}" no longer exists` });
        }
        if (product.inventory < item.quantity) {
          return res.status(400).json({ 
            message: `"${item.name}" only has ${product.inventory} left in stock` 
          });
        }
      }
    }

    const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name
      },
      unit_amount: Math.round(Number(item.price) * 100)
    },
    quantity: item.quantity
  }));

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${frontendUrl}/cart?success=true`,
    cancel_url: `${frontendUrl}/cart?canceled=true`,
    // Only include customer_email if it's a non-empty, valid email string.
    ...(email && typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? { customer_email: email }
      : (email ? (console.warn(`Invalid customer email provided for checkout: '${email}'`), {}) : {}))
  });

  await Order.create({
    items,
    total,
    stripeSessionId: session.id,
    email
  });

  res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe order checkout error:", error);
    res.status(500).json({ message: "Unable to start checkout" });
  }
}

/**
 * Stripe webhook handler — confirms payment and updates order/donation status
 * Receives raw body (use express.raw when mounting the route)
 */
export async function handleStripeWebhook(req, res) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  if (webhookSecret) {
    const sig = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }
  } else {
    // In development without webhook secret, parse event directly
    event = req.body;
    console.warn("⚠️ No STRIPE_WEBHOOK_SECRET set — skipping signature verification (dev only)");
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const sessionId = session.id;

        // Check for idempotency — skip if already processed
        const existingOrder = await Order.findOne({ stripeSessionId: sessionId, status: "completed" });
        const existingDonation = await Donation.findOne({ stripeSessionId: sessionId, status: "completed" });

        if (existingOrder || existingDonation) {
          console.log(`ℹ️ Session ${sessionId} already processed — skipping (idempotent)`);
          return res.json({ received: true });
        }

        // Try to update an order
        const order = await Order.findOneAndUpdate(
          { stripeSessionId: sessionId, status: "pending" },
          { status: "completed", email: session.customer_email || undefined },
          { new: true }
        );

        if (order) {
          console.log(`✅ Order ${order._id} marked as completed`);

          // Decrement inventory for each item in the order
          for (const item of order.items) {
            if (item.productId) {
              await Product.findByIdAndUpdate(item.productId, {
                $inc: { inventory: -item.quantity }
              });
            }
          }

          // Send receipt email (non-blocking)
          if (order.email) {
            sendOrderReceipt(order.email, order.email, order).catch((err) => {
              console.error("Failed to send order receipt (webhook):", err);
            });
          }
        }

        // Try to update a donation
        const donation = await Donation.findOneAndUpdate(
          { stripeSessionId: sessionId, status: "pending" },
          { status: "completed", email: session.customer_email || undefined },
          { new: true }
        );

        if (donation) {
          console.log(`✅ Donation ${donation._id} marked as completed`);
          if (donation.email) {
            sendDonationReceipt(donation.email, donation.email, donation).catch((err) => {
              console.error("Failed to send donation receipt (webhook):", err);
            });
          }
        }

        if (!order && !donation) {
          console.warn(`⚠️ No pending order or donation found for session ${sessionId}`);
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const sessionId = session.id;

        // Mark expired sessions as cancelled
        await Order.findOneAndUpdate(
          { stripeSessionId: sessionId, status: "pending" },
          { status: "cancelled" }
        );
        await Donation.findOneAndUpdate(
          { stripeSessionId: sessionId, status: "pending" },
          { status: "cancelled" }
        );

        console.log(`❌ Session ${sessionId} expired — marked as cancelled`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ message: "Webhook processing failed" });
  }
}
