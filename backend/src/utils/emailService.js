import nodemailer from "nodemailer";

// Create Gmail transporter
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  
  if (!user || !pass) {
    console.warn("EMAIL_USER/EMAIL_PASS not configured - emails will not be sent");
    return null;
  }
  
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
};

/**
 * Send verification code email
 */
export async function sendVerificationEmail(to, code, name) {
  const transporter = getTransporter();
  
  if (!transporter) {
    console.log(`[DEV] Verification code for ${to}: ${code}`);
    return { success: false, fallback: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🐱 Your Royal Verification Code - Banana Meow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef9e7;">
          <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 24px; padding: 32px; text-align: center;">
              <h1 style="color: #fff; margin: 0 0 8px 0; font-size: 28px;">🍌 Banana Meow 🐱</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">The Royal Cat Court</p>
            </div>
            
            <div style="background: #fff; border-radius: 24px; padding: 32px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <h2 style="color: #4c1d95; margin: 0 0 16px 0; font-size: 22px;">Welcome, ${name}! 👑</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px 0;">
                You're just one step away from joining the royal court! Enter this verification code to complete your registration:
              </p>
              
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
                <p style="color: #92400e; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0;">Your Code</p>
                <p style="color: #4c1d95; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${code}</p>
              </div>
              
              <p style="color: #9ca3af; font-size: 13px; text-align: center; margin: 24px 0 0 0;">
                This code expires in <strong>10 minutes</strong>.<br>
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
              Made with 💛 by Banana Meow Team
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✉️ Verification email sent to ${to} (id: ${info.messageId})`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send welcome email after successful registration
 */
export async function sendWelcomeEmail(to, name) {
  const transporter = getTransporter();
  
  if (!transporter) {
    console.log(`[DEV] Welcome email would be sent to ${to}`);
    return { success: false, fallback: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
      to,
      subject: "👑 Welcome to the Royal Court - Banana Meow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef9e7;">
          <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 24px; padding: 32px; text-align: center;">
              <h1 style="color: #fff; margin: 0 0 8px 0; font-size: 28px;">🍌 Banana Meow 🐱</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">The Royal Cat Court</p>
            </div>
            
            <div style="background: #fff; border-radius: 24px; padding: 32px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <h2 style="color: #4c1d95; margin: 0 0 16px 0; font-size: 24px;">Welcome to the Court, ${name}! 🎉</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 16px 0;">
                You are now officially a member of the Banana Meow royal family! Our furry rulers are delighted to have you.
              </p>
              
              <div style="background: #fef3c7; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  🐱 Meet our adorable cats<br>
                  🛍️ Shop royal merchandise<br>
                  💛 Support our cat rescue mission
                </p>
              </div>
              
              <p style="color: #6b7280; line-height: 1.6; margin: 0;">
                Thank you for joining us. Every purchase helps support rescued cats in need!
              </p>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
              Made with 💛 by Banana Meow Team
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✉️ Welcome email sent to ${to} (id: ${info.messageId})`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("Welcome email send failed:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(to, name, resetUrl) {
  const transporter = getTransporter();
  
  if (!transporter) {
    console.log(`[DEV] Password reset link for ${to}: ${resetUrl}`);
    return { success: false, fallback: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🔒 Reset Your Password - Banana Meow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef9e7;">
          <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 24px; padding: 32px; text-align: center;">
              <h1 style="color: #fff; margin: 0 0 8px 0; font-size: 28px;">🍌 Banana Meow 🐱</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">The Royal Cat Court</p>
            </div>
            
            <div style="background: #fff; border-radius: 24px; padding: 32px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <h2 style="color: #4c1d95; margin: 0 0 16px 0; font-size: 22px;">Hello, ${name}!</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px 0;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: #fff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0;">
                <strong>This link will expire in 30 minutes.</strong><br>
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              
              <div style="background: #fef3c7; border-radius: 12px; padding: 16px; margin: 24px 0; border-left: 4px solid #fbbf24;">
                <p style="color: #92400e; margin: 0; font-size: 13px; line-height: 1.5;">
                  <strong>⚠️ Security Notice:</strong><br>
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <span style="word-break: break-all; color: #7c3aed;">${resetUrl}</span>
                </p>
              </div>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
              Made with 💛 by Banana Meow Team
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✉️ Password reset email sent to ${to} (id: ${info.messageId})`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("Password reset email send failed:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send password change notification email
 */
export async function sendPasswordChangeNotification(to, name) {
  const transporter = getTransporter();
  
  if (!transporter) {
    console.log(`[DEV] Password change notification would be sent to ${to}`);
    return { success: false, fallback: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🔒 Password Updated - Banana Meow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef9e7;">
          <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 24px; padding: 32px; text-align: center;">
              <h1 style="color: #fff; margin: 0 0 8px 0; font-size: 28px;">🍌 Banana Meow 🐱</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">The Royal Cat Court</p>
            </div>
            
            <div style="background: #fff; border-radius: 24px; padding: 32px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <h2 style="color: #4c1d95; margin: 0 0 16px 0; font-size: 24px;">Password Updated Successfully 🔒</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 16px 0;">
                Hello ${name},
              </p>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 24px 0;">
                This is a confirmation that your password has been successfully updated on your Banana Meow account.
              </p>
              
              <div style="background: #fef3c7; border-radius: 12px; padding: 16px; margin: 20px 0; border-left: 4px solid #fbbf24;">
                <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 600;">
                  ⚠️ Security Notice
                </p>
                <p style="color: #92400e; margin: 8px 0 0 0; font-size: 13px; line-height: 1.5;">
                  If you did not make this change, please contact us immediately to secure your account.
                </p>
              </div>
              
              <p style="color: #6b7280; line-height: 1.6; margin: 24px 0 0 0; font-size: 14px;">
                Your account security is important to us. If you have any concerns, please don't hesitate to reach out.
              </p>
            </div>
            
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
              Made with 💛 by Banana Meow Team
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✉️ Password change notification sent to ${to} (id: ${info.messageId})`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("Password change notification send failed:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(to, order) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[DEV] Order confirmation would be sent to ${to} for order ${order._id}`);
    return { success: false, fallback: true };
  }

  try {
    const itemsList = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6;">${item.name}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join("");

    const info = await transporter.sendMail({
      from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Order Confirmed - Banana Meow",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef9e7;">
          <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 24px; padding: 32px; text-align: center;">
              <h1 style="color: #fff; margin: 0 0 8px 0; font-size: 28px;">Banana Meow</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Order Confirmation</p>
            </div>
            <div style="background: #fff; border-radius: 24px; padding: 32px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <h2 style="color: #4c1d95; margin: 0 0 16px 0; font-size: 22px;">Thank you for your order!</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 16px 0;">
                Your order has been confirmed and is being processed.
              </p>
              <div style="background: #fef3c7; border-radius: 12px; padding: 12px 16px; margin: 16px 0;">
                <p style="color: #92400e; margin: 0; font-size: 13px;"><strong>Order ID:</strong> ${order._id}</p>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 8px 12px; text-align: left; color: #4c1d95;">Item</th>
                    <th style="padding: 8px 12px; text-align: center; color: #4c1d95;">Qty</th>
                    <th style="padding: 8px 12px; text-align: right; color: #4c1d95;">Total</th>
                  </tr>
                </thead>
                <tbody style="color: #6b7280;">
                  ${itemsList}
                </tbody>
              </table>
              <div style="text-align: right; padding: 12px 0; border-top: 2px solid #7c3aed;">
                <p style="color: #4c1d95; font-size: 18px; font-weight: bold; margin: 0;">Total: $${order.total.toFixed(2)}</p>
              </div>
              <p style="color: #6b7280; font-size: 13px; margin: 16px 0 0 0;">
                Every purchase helps support rescued cats in need. Thank you!
              </p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">Made with love by Banana Meow Team</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`Order confirmation sent to ${to} (id: ${info.messageId})`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("Order confirmation email failed:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send donation thank-you email
 */
export async function sendDonationThankYouEmail(to, donation) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[DEV] Donation thank-you would be sent to ${to}`);
    return { success: false, fallback: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Thank You for Your Donation - Banana Meow",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef9e7;">
          <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 24px; padding: 32px; text-align: center;">
              <h1 style="color: #fff; margin: 0 0 8px 0; font-size: 28px;">Banana Meow</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">The Royal Cat Court</p>
            </div>
            <div style="background: #fff; border-radius: 24px; padding: 32px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <h2 style="color: #4c1d95; margin: 0 0 16px 0; font-size: 24px;">Thank You for Your Generosity!</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 16px 0;">
                Your ${donation.frequency} donation of <strong>$${donation.amount.toFixed(2)}</strong> for <strong>${donation.cat}</strong> has been received.
              </p>
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
                <p style="color: #92400e; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0;">Donation Type</p>
                <p style="color: #4c1d95; font-size: 20px; font-weight: bold; margin: 0;">${donation.type}</p>
              </div>
              <p style="color: #6b7280; line-height: 1.6; margin: 0;">
                Your support makes a real difference in the lives of our rescued feline friends. Thank you for being part of the Banana Meow family!
              </p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">Made with love by Banana Meow Team</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`Donation thank-you sent to ${to} (id: ${info.messageId})`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("Donation thank-you email failed:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send contact reply email
 */
export async function sendContactReplyEmail(to, name, subject, reply) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[DEV] Contact reply would be sent to ${to}`);
    return { success: false, fallback: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Banana Meow Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Re: ${subject} - Banana Meow`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef9e7;">
          <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 24px; padding: 32px; text-align: center;">
              <h1 style="color: #fff; margin: 0 0 8px 0; font-size: 28px;">Banana Meow</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Support Team</p>
            </div>
            <div style="background: #fff; border-radius: 24px; padding: 32px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <h2 style="color: #4c1d95; margin: 0 0 16px 0; font-size: 22px;">Hello, ${name}!</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 16px 0;">
                We've reviewed your inquiry and here's our response:
              </p>
              <div style="background: #f9fafb; border-left: 4px solid #7c3aed; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-line;">${reply}</p>
              </div>
              <p style="color: #6b7280; line-height: 1.6; margin: 16px 0 0 0; font-size: 14px;">
                If you have any more questions, feel free to reply or submit another inquiry.
              </p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">Made with love by Banana Meow Team</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`Contact reply sent to ${to} (id: ${info.messageId})`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("Contact reply email failed:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send newsletter welcome email
 */
export async function sendNewsletterWelcomeEmail(to, name) {
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`[DEV] Newsletter welcome would be sent to ${to}`);
    return { success: false, fallback: true };
  }

  const displayName = name || "Cat Lover";

  try {
    const info = await transporter.sendMail({
      from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Welcome to the Banana Meow Newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fef9e7;">
          <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); border-radius: 24px; padding: 32px; text-align: center;">
              <h1 style="color: #fff; margin: 0 0 8px 0; font-size: 28px;">Banana Meow</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Newsletter</p>
            </div>
            <div style="background: #fff; border-radius: 24px; padding: 32px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <h2 style="color: #4c1d95; margin: 0 0 16px 0; font-size: 24px;">Welcome, ${displayName}!</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 16px 0;">
                You've successfully subscribed to the Banana Meow newsletter! Here's what you can expect:
              </p>
              <div style="background: #fef3c7; border-radius: 12px; padding: 16px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.8;">
                  Adorable cat updates and photos<br>
                  Exclusive deals and new products<br>
                  Behind-the-scenes at the cat court<br>
                  Heartwarming rescue stories
                </p>
              </div>
              <p style="color: #6b7280; line-height: 1.6; margin: 0;">
                Stay tuned for purr-fect content delivered straight to your inbox!
              </p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">Made with love by Banana Meow Team</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`Newsletter welcome sent to ${to} (id: ${info.messageId})`);
    return { success: true, id: info.messageId };
  } catch (err) {
    console.error("Newsletter welcome email failed:", err);
    return { success: false, error: err.message };
  }
}
