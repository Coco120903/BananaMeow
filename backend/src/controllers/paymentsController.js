import Stripe from "stripe";
import Donation from "../models/Donation.js";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

export async function createDonationCheckout(req, res) {
  const { amount, frequency, type, cat } = req.body;

  try {
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
    customer_email: email
  });

  await Order.create({
    items,
    total,
    stripeSessionId: session.id,
    email
  });

  res.json({ url: session.url });
}
