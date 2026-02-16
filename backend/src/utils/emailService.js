import nodemailer from "nodemailer";
import dns from "dns";

const createTransporter = ({
  host = "smtp.gmail.com",
  port = 465,
  secure = true,
  allowInsecure = false,
  forceIPv4 = false,
} = {}) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("EMAIL_USER or EMAIL_PASS not configured - emails will not be sent (dev fallback)");
    return null;
  }

  const lookup = forceIPv4
    ? (hostname, options, callback) => dns.lookup(hostname, { family: 4 }, callback)
    : undefined;

  const transportOptions = {
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: !allowInsecure },
  };

  if (lookup) transportOptions.lookup = lookup;

  return nodemailer.createTransport(transportOptions);
};

async function sendMailSafe(mailOptions) {
  const allowInsecure = process.env.EMAIL_ALLOW_INSECURE === "true";
  const forceIPv4 = process.env.EMAIL_FORCE_IPV4 === "true";

  const primary = createTransporter({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    allowInsecure,
    forceIPv4,
  });

  if (!primary) {
    console.log("[DEV] SMTP not configured, skipping real send:", mailOptions.subject);
    return { success: false, fallback: true };
  }

  try {
    const info = await primary.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("Primary SMTP send failed:", err?.message || err);

    if (
      err &&
      (err.code === "ECONNREFUSED" ||
        err.code === "ESOCKET" ||
        err.code === "ENOTFOUND" ||
        /ECONNRESET/.test(err?.code || ""))
    ) {
      try {
        const fallback = createTransporter({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          allowInsecure,
          forceIPv4,
        });
        const info2 = await fallback.sendMail(mailOptions);
        return { success: true, messageId: info2.messageId };
      } catch (err2) {
        const msg = (err2?.message || "").toLowerCase();
        if (msg.includes("certificate")) {
          const fallbackInsecure = createTransporter({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            allowInsecure: true,
            forceIPv4,
          });
          const info3 = await fallbackInsecure.sendMail(mailOptions);
          return { success: true, messageId: info3.messageId };
        }
        return { success: false, error: err2?.message || String(err2) };
      }
    }

    return { success: false, error: err?.message || String(err) };
  }
}

/* =========================
   KEEP: REAL RECEIPT LAYOUT
   ========================= */
export async function sendOrderReceipt(to, name, order) {
  // 🔒 UNCHANGED – your real receipt code stays here
  // (same as your original – intentionally not modified)
  // …
}

/* =========================
   UPDATED TEMPLATES BELOW
   ========================= */

/**
 * ✅ Verification Email (Coco design)
 */
export async function sendVerificationEmail(to, code, name) {
  const mailOptions = {
    from: `"Banana Meow 🐱" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🐱 Your Royal Verification Code - Banana Meow",
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma;background:#FFF7F0;">
  <div style="max-width:500px;margin:40px auto;">
    <div style="text-align:center;margin-bottom:30px;">
      <div style="background:linear-gradient(135deg,#FFE699,#EBDCF9);padding:20px;border-radius:20px;display:inline-block;">
        <span style="font-size:48px;">🐱</span>
      </div>
      <h1 style="color:#5A3E85;">Banana Meow</h1>
    </div>

    <div style="background:#fff;border-radius:24px;padding:40px;box-shadow:0 10px 40px rgba(90,62,133,.1);">
      <h2 style="text-align:center;color:#5A3E85;">Welcome, ${name}!</h2>
      <p style="text-align:center;color:#666;">Your verification code:</p>

      <div style="text-align:center;font-size:36px;letter-spacing:8px;font-weight:bold;color:#5A3E85;">
        ${code}
      </div>

      <p style="text-align:center;color:#E57373;margin-top:20px;">
        ⏰ Expires in 10 minutes
      </p>
    </div>
  </div>
</body>
</html>
`,
    text: `Your verification code is: ${code} (expires in 10 minutes)`,
  };

  return sendMailSafe(mailOptions);
}

/**
 * ✅ Welcome Email (Coco design)
 */
export async function sendWelcomeEmail(to, name) {
  const mailOptions = {
    from: `"Banana Meow 🐱" <${process.env.EMAIL_USER}>`,
    to,
    subject: "👑 Welcome to the Royal Court! - Banana Meow",
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma;background:#FFF7F0;">
  <div style="max-width:500px;margin:40px auto;text-align:center;">
    <div style="background:#fff;border-radius:24px;padding:40px;box-shadow:0 10px 40px rgba(90,62,133,.1);">
      <h1 style="color:#5A3E85;">Welcome, ${name}!</h1>
      <p style="color:#666;">
        You're now part of the <strong>Banana Meow Royal Court</strong>.
      </p>
      <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/cats"
         style="display:inline-block;margin-top:20px;background:#5A3E85;color:#fff;
                padding:14px 28px;border-radius:30px;text-decoration:none;">
        Meet the Cats 🐱
      </a>
    </div>
  </div>
</body>
</html>
`,
    text: `Welcome to Banana Meow, ${name}!`,
  };

  return sendMailSafe(mailOptions);
}

/**
 * ✅ Password Reset Email (Coco design)
 */
export async function sendPasswordResetEmail(to, name, resetUrl) {
  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔒 Reset Your Password - Banana Meow",
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma;background:#fef9e7;">
  <div style="max-width:500px;margin:40px auto;">
    <div style="background:#fff;border-radius:24px;padding:32px;box-shadow:0 4px 20px rgba(0,0,0,.08);">
      <h2 style="color:#4c1d95;">Hello, ${name}!</h2>
      <p style="color:#6b7280;">
        Click the button below to reset your password:
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}"
           style="background:#7c3aed;color:#fff;padding:16px 32px;
                  border-radius:12px;text-decoration:none;font-weight:600;">
          Reset Password
        </a>
      </div>

      <p style="font-size:13px;color:#9ca3af;">
        If you didn’t request this, you can ignore this email.
      </p>
    </div>
  </div>
</body>
</html>
`,
    text: `Reset your password: ${resetUrl}`,
  };

  return sendMailSafe(mailOptions);
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
