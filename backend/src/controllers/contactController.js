import Contact from "../models/Contact.js";
import { sendContactReplyEmail } from "../utils/emailService.js";

// @desc    Submit a contact form
// @route   POST /api/contact
export async function submitContact(req, res) {
  try {
    const { name, email, subject, message, category } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    if (name.length > 100) {
      return res.status(400).json({ message: "Name cannot exceed 100 characters" });
    }
    if (subject.length > 200) {
      return res.status(400).json({ message: "Subject cannot exceed 200 characters" });
    }
    if (message.length > 5000) {
      return res.status(400).json({ message: "Message cannot exceed 5000 characters" });
    }

    const contactData = { name, email, subject, message };
    if (category) contactData.category = category;

    // If user is logged in, attach userId
    if (req.user) {
      contactData.userId = req.user._id;
    }

    const contact = await Contact.create(contactData);

    res.status(201).json({
      message: "Your message has been sent successfully! We'll get back to you soon.",
      ticketId: contact._id
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Error submitting your message" });
  }
}

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
export async function getContacts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const category = req.query.category;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;
    const total = await Contact.countDocuments(filter);

    const contacts = await Contact.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      contacts,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Error fetching contact messages" });
  }
}

// @desc    Get single contact message (admin)
// @route   GET /api/contact/:id
export async function getContactById(req, res) {
  try {
    const contact = await Contact.findById(req.params.id).populate("userId", "name email");
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    res.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Error fetching contact message" });
  }
}

// @desc    Update contact status (admin)
// @route   PUT /api/contact/:id/status
export async function updateContactStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "in-progress", "resolved", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.json(contact);
  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({ message: "Error updating contact status" });
  }
}

// @desc    Reply to a contact message (admin)
// @route   POST /api/contact/:id/reply
export async function replyToContact(req, res) {
  try {
    const { reply } = req.body;
    if (!reply || reply.trim().length === 0) {
      return res.status(400).json({ message: "Please provide a reply" });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    contact.adminReply = reply.trim();
    contact.repliedAt = new Date();
    contact.status = "resolved";
    await contact.save();

    // Send reply email
    await sendContactReplyEmail(contact.email, contact.name, contact.subject, reply.trim());

    res.json({ message: "Reply sent successfully", contact });
  } catch (error) {
    console.error("Error replying to contact:", error);
    res.status(500).json({ message: "Error sending reply" });
  }
}

// @desc    Delete a contact message (admin)
// @route   DELETE /api/contact/:id
export async function deleteContact(req, res) {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    res.json({ message: "Contact message deleted" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Error deleting contact message" });
  }
}
