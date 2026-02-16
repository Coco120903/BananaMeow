import crypto from "crypto";
import Newsletter from "../models/Newsletter.js";
import { sendNewsletterWelcomeEmail } from "../utils/emailService.js";

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
export async function subscribe(req, res) {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide your email" });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.isActive) {
        return res.status(400).json({ message: "You are already subscribed to our newsletter" });
      }
      // Re-subscribe
      existing.isActive = true;
      existing.unsubscribedAt = undefined;
      existing.unsubscribeToken = crypto.randomBytes(32).toString("hex");
      if (name) existing.name = name;
      await existing.save();

      await sendNewsletterWelcomeEmail(existing.email, existing.name);
      return res.json({ message: "Welcome back! You have been re-subscribed." });
    }

    const subscriber = await Newsletter.create({
      email: email.toLowerCase(),
      name: name?.trim(),
      unsubscribeToken: crypto.randomBytes(32).toString("hex")
    });

    await sendNewsletterWelcomeEmail(subscriber.email, subscriber.name);

    res.status(201).json({ message: "Successfully subscribed to the Banana Meow newsletter!" });
  } catch (error) {
    console.error("Error subscribing:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "This email is already subscribed" });
    }
    res.status(500).json({ message: "Error subscribing to newsletter" });
  }
}

// @desc    Unsubscribe from newsletter
// @route   GET /api/newsletter/unsubscribe/:token
export async function unsubscribe(req, res) {
  try {
    const { token } = req.params;

    const subscriber = await Newsletter.findOne({ unsubscribeToken: token });
    if (!subscriber) {
      return res.status(404).json({ message: "Invalid unsubscribe link" });
    }

    if (!subscriber.isActive) {
      return res.json({ message: "You are already unsubscribed" });
    }

    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({ message: "You have been successfully unsubscribed from the Banana Meow newsletter." });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    res.status(500).json({ message: "Error unsubscribing" });
  }
}

// @desc    Get all subscribers (admin)
// @route   GET /api/newsletter/subscribers
export async function getSubscribers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const activeOnly = req.query.active !== "false";

    const filter = activeOnly ? { isActive: true } : {};
    const skip = (page - 1) * limit;
    const total = await Newsletter.countDocuments(filter);

    const subscribers = await Newsletter.find(filter)
      .select("-unsubscribeToken")
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);

    const activeCount = await Newsletter.countDocuments({ isActive: true });

    res.json({
      subscribers,
      page,
      totalPages: Math.ceil(total / limit),
      total,
      activeCount
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    res.status(500).json({ message: "Error fetching subscribers" });
  }
}

// @desc    Get newsletter stats (admin)
// @route   GET /api/newsletter/stats
export async function getNewsletterStats(req, res) {
  try {
    const totalSubscribers = await Newsletter.countDocuments({ isActive: true });
    const totalUnsubscribed = await Newsletter.countDocuments({ isActive: false });

    // New subscribers this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = await Newsletter.countDocuments({
      subscribedAt: { $gte: weekAgo },
      isActive: true
    });

    // New subscribers this month
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const newThisMonth = await Newsletter.countDocuments({
      subscribedAt: { $gte: monthAgo },
      isActive: true
    });

    res.json({
      totalSubscribers,
      totalUnsubscribed,
      newThisWeek,
      newThisMonth
    });
  } catch (error) {
    console.error("Error fetching newsletter stats:", error);
    res.status(500).json({ message: "Error fetching newsletter stats" });
  }
}

// @desc    Delete a subscriber (admin)
// @route   DELETE /api/newsletter/subscribers/:id
export async function deleteSubscriber(req, res) {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    res.json({ message: "Subscriber removed" });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    res.status(500).json({ message: "Error removing subscriber" });
  }
}
