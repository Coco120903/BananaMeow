import nodemailer from "nodemailer";

/**
 * POST /api/contact
 * Receives contact form submissions and sends them via email
 */
export async function submitContactForm(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }
    if (message.trim().length < 10) {
      return res.status(400).json({ message: "Message must be at least 10 characters" });
    }

    // Honeypot spam check — if website field is filled, it's a bot
    if (req.body.website) {
      // Silently accept to not tip off bots, but don't send
      console.log("🤖 Honeypot triggered — spam blocked");
      return res.json({ message: "Thank you! We'll get back to you soon." });
    }

    // Send email notification
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const contactRecipient = process.env.CONTACT_EMAIL || emailUser;

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: emailUser, pass: emailPass },
      });

      await transporter.sendMail({
        from: `"Banana Meow Contact" <${emailUser}>`,
        to: contactRecipient,
        replyTo: email,
        subject: `[Contact Form] ${subject || "New Message"} — from ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF7F0;">
            <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: linear-gradient(135deg, #5A3E85 0%, #8B6DB3 100%); border-radius: 24px; padding: 24px; text-align: center; margin-bottom: 20px;">
                <h1 style="color: #fff; margin: 0; font-size: 24px;">🐱 New Contact Message</h1>
              </div>
              <div style="background: #fff; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <p style="color: #5A3E85; font-weight: 600; margin: 0 0 4px;">From:</p>
                <p style="color: #666; margin: 0 0 16px;">${name} (${email})</p>
                <p style="color: #5A3E85; font-weight: 600; margin: 0 0 4px;">Subject:</p>
                <p style="color: #666; margin: 0 0 16px;">${subject || "No subject"}</p>
                <p style="color: #5A3E85; font-weight: 600; margin: 0 0 4px;">Message:</p>
                <div style="background: #F9F5FF; border-radius: 12px; padding: 16px; margin-top: 8px;">
                  <p style="color: #444; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
                Sent via Banana Meow contact form
              </p>
            </div>
          </body>
          </html>
        `,
        text: `New contact from ${name} (${email})\nSubject: ${subject || "No subject"}\n\n${message}`,
      });

      console.log(`✉️ Contact form email sent from ${name} (${email})`);
    } else {
      // Log to console in development when email is not configured
      console.log(`[DEV] Contact form submission:`);
      console.log(`  Name: ${name}`);
      console.log(`  Email: ${email}`);
      console.log(`  Subject: ${subject || "No subject"}`);
      console.log(`  Message: ${message}`);
    }

    res.json({ message: "Thank you! We'll get back to you soon." });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
}
