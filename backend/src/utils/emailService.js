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
