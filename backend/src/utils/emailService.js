import nodemailer from "nodemailer";
import dns from "dns";

// ─── SMTP TRANSPORT ─────────────────────────────────────────────────────────

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

function getTransporter() {
  return createTransporter();
}

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

// ─── REUSABLE EMAIL TEMPLATE SYSTEM ─────────────────────────────────────────
//
// Branded, responsive, email-client-safe HTML layout used by every email.
// Uses table-based layout with inline CSS for maximum compatibility
// (Gmail, Outlook, Apple Mail, mobile clients).
//
// Brand colors:
//   Royal Purple  #5B3E8F    Banana Gold  #F5D76E
//   Lilac Mist    #EBDCF9    Warm Cream   #FFF8F0
//   Ink           #3D3250    Muted        #8B7FA3

const BRAND = {
  purple: "#5B3E8F",
  purpleDark: "#432D6B",
  gold: "#F5D76E",
  goldLight: "#FFF4CC",
  lilac: "#EBDCF9",
  cream: "#FFF8F0",
  white: "#FFFFFF",
  ink: "#3D3250",
  muted: "#8B7FA3",
  mutedLight: "#B5ADBD",
  border: "#EDE8F4",
  success: "#3DAA6D",
  alert: "#E07272",
  fontStack: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

/**
 * Wraps email body content in the branded BananaMeow layout.
 *
 * @param {Object} options
 * @param {string} options.preheader  - Hidden preview text for inbox
 * @param {string} options.subtitle   - Small text below "Banana Meow" in header (e.g. "Verification")
 * @param {string} options.body       - Inner HTML content
 * @returns {string}                  - Full HTML email string
 */
function emailLayout({ preheader = "", subtitle = "", body = "" }) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>Banana Meow</title>
  <!--[if mso]>
  <noscript><xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml></noscript>
  <![endif]-->
  <style type="text/css">
    body, table, td { font-family: ${BRAND.fontStack}; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { color: ${BRAND.purple}; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; padding: 16px !important; }
      .email-card { padding: 28px 20px !important; }
      .email-header { padding: 24px 20px !important; }
      .cta-btn { padding: 14px 24px !important; font-size: 15px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${BRAND.cream}; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  ${preheader ? `<div style="display:none;font-size:1px;color:${BRAND.cream};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>` : ""}

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${BRAND.cream};">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <!-- Email container -->
        <table role="presentation" class="email-container" width="580" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; width: 100%;">

          <!-- ===== HEADER ===== -->
          <tr>
            <td class="email-header" align="center" style="background: linear-gradient(135deg, ${BRAND.purple} 0%, #7C5BB0 50%, ${BRAND.purple} 100%); border-radius: 20px 20px 0 0; padding: 32px 24px 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <!-- Cat icon circle -->
                    <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.15); border-radius: 50%; line-height: 56px; text-align: center; font-size: 28px; margin: 0 auto 12px;">
                      &#128049;
                    </div>
                    <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: ${BRAND.white}; letter-spacing: 0.5px;">Banana Meow</h1>
                    ${subtitle ? `<p style="margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.75); letter-spacing: 0.5px;">${subtitle}</p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ===== BODY CARD ===== -->
          <tr>
            <td class="email-card" style="background: ${BRAND.white}; padding: 36px 32px 40px; border-left: 1px solid ${BRAND.border}; border-right: 1px solid ${BRAND.border};">
              ${body}
            </td>
          </tr>

          <!-- ===== FOOTER ===== -->
          <tr>
            <td style="background: ${BRAND.white}; border-top: 1px solid ${BRAND.border}; border-radius: 0 0 20px 20px; padding: 24px 32px 28px; border-left: 1px solid ${BRAND.border}; border-right: 1px solid ${BRAND.border}; border-bottom: 1px solid ${BRAND.border};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px; font-size: 13px; color: ${BRAND.muted};">
                      Made with &#10084;&#65039; by the Banana Meow Team
                    </p>
                    <p style="margin: 0 0 12px; font-size: 12px; color: ${BRAND.mutedLight};">
                      <a href="${frontendUrl}" style="color: ${BRAND.muted}; text-decoration: underline;">Visit our website</a>
                      &nbsp;&bull;&nbsp;
                      <a href="mailto:${process.env.EMAIL_USER || "meow@bananameow.com"}" style="color: ${BRAND.muted}; text-decoration: underline;">Contact support</a>
                    </p>
                    <p style="margin: 0; font-size: 11px; color: ${BRAND.mutedLight};">
                      &copy; ${year} Banana Meow. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Email container -->

      </td>
    </tr>
  </table>
  <!-- /Outer wrapper -->
</body>
</html>`;
}

/**
 * Generates a styled CTA button (table-based for Outlook compatibility).
 */
function ctaButton(text, href, { color = BRAND.white, bg = BRAND.purple } = {}) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
    <tr>
      <td align="center" style="border-radius: 12px; background: ${bg};">
        <a href="${href}" target="_blank" class="cta-btn" style="display: inline-block; padding: 15px 32px; font-family: ${BRAND.fontStack}; font-size: 16px; font-weight: 600; color: ${color}; text-decoration: none; border-radius: 12px; background: ${bg}; mso-padding-alt: 0;">
          <!--[if mso]><i style="mso-font-width:-100%;mso-text-raise:22pt;">&nbsp;</i><![endif]-->
          <span style="mso-text-raise: 11pt;">${text}</span>
          <!--[if mso]><i style="mso-font-width:-100%;">&nbsp;</i><![endif]-->
        </a>
      </td>
    </tr>
  </table>`;
}

/**
 * Styled info/highlight box.
 */
function infoBox(content, { bg = BRAND.goldLight, borderColor = BRAND.gold, textColor = "#7A6520" } = {}) {
  return `
  <div style="background: ${bg}; border-left: 4px solid ${borderColor}; border-radius: 0 12px 12px 0; padding: 16px 20px; margin: 20px 0;">
    ${content}
  </div>`;
}

/**
 * Heading style helper.
 */
function heading(text) {
  return `<h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 700; color: ${BRAND.ink}; line-height: 1.3;">${text}</h2>`;
}

/**
 * Paragraph style helper.
 */
function para(text, { size = "15px", color = BRAND.muted, margin = "0 0 16px" } = {}) {
  return `<p style="margin: ${margin}; font-size: ${size}; line-height: 1.65; color: ${color};">${text}</p>`;
}

/**
 * Divider.
 */
function divider() {
  return `<hr style="border: none; border-top: 1px solid ${BRAND.border}; margin: 24px 0;">`;
}

// ─── EMAIL TEMPLATES ────────────────────────────────────────────────────────

/**
 * ✅ Verification Email
 * Signature: (to, code, name)
 */
export async function sendVerificationEmail(to, code, name) {
  const displayName = name || "there";
  const safeCode = String(code).replace(/[<>&"']/g, "");

  const html = emailLayout({
    preheader: `Your Banana Meow verification code is ${safeCode}`,
    subtitle: "Email Verification",
    body: `
      ${heading(`Welcome, ${displayName}! &#128075;`)}
      ${para("Thanks for signing up! Please use the verification code below to confirm your email address and join the Royal Cat Court.")}

      <!-- Code box -->
      <div style="text-align: center; margin: 28px 0;">
        <div style="display: inline-block; background: linear-gradient(135deg, ${BRAND.lilac} 0%, ${BRAND.goldLight} 100%); border-radius: 16px; padding: 20px 40px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: ${BRAND.purple}; font-family: 'Courier New', Courier, monospace;">${safeCode}</span>
        </div>
      </div>

      ${infoBox(`
        <p style="margin: 0; font-size: 13px; color: #7A6520;">
          &#9200; This code expires in <strong>10 minutes</strong>. If you didn't create an account, you can safely ignore this email.
        </p>
      `)}

      ${para("Enter this code on the verification page to complete your registration.", { margin: "0" })}
    `,
  });

  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email — Banana Meow",
    html,
    text: `Hi ${displayName},\n\nYour Banana Meow verification code is: ${safeCode}\n\nThis code expires in 10 minutes.\n\nIf you didn't create an account, please ignore this email.\n\n— Banana Meow Team`,
  };

  return sendMailSafe(mailOptions);
}

/**
 * ✅ Welcome Email
 * Signature: (to, name)
 */
export async function sendWelcomeEmail(to, name) {
  const displayName = name || "Cat Lover";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const html = emailLayout({
    preheader: `Welcome to Banana Meow, ${displayName}! Your royal adventure begins now.`,
    subtitle: "Welcome to the Royal Court",
    body: `
      ${heading(`You're In, ${displayName}! &#127881;`)}
      ${para("Your email has been verified and your royal journey begins now. Welcome to the Banana Meow family — a community of cat lovers, cute merch, and rescued chonky royals.")}

      <!-- Feature highlights -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
        <tr>
          <td style="padding: 12px 16px; background: ${BRAND.lilac}30; border-radius: 12px; margin-bottom: 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width: 36px; font-size: 20px; vertical-align: top; padding-top: 2px;">&#128049;</td>
                <td style="padding-left: 8px;">
                  <p style="margin: 0; font-size: 14px; color: ${BRAND.ink}; font-weight: 600;">Meet the Cats</p>
                  <p style="margin: 4px 0 0; font-size: 13px; color: ${BRAND.muted};">Get to know our rescued royal chonks</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height: 8px;"></td></tr>
        <tr>
          <td style="padding: 12px 16px; background: ${BRAND.goldLight}60; border-radius: 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width: 36px; font-size: 20px; vertical-align: top; padding-top: 2px;">&#128092;</td>
                <td style="padding-left: 8px;">
                  <p style="margin: 0; font-size: 14px; color: ${BRAND.ink}; font-weight: 600;">Browse the Shop</p>
                  <p style="margin: 4px 0 0; font-size: 13px; color: ${BRAND.muted};">Cute cat merch & accessories</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height: 8px;"></td></tr>
        <tr>
          <td style="padding: 12px 16px; background: ${BRAND.lilac}30; border-radius: 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width: 36px; font-size: 20px; vertical-align: top; padding-top: 2px;">&#128248;</td>
                <td style="padding-left: 8px;">
                  <p style="margin: 0; font-size: 14px; color: ${BRAND.ink}; font-weight: 600;">Royal Gallery</p>
                  <p style="margin: 4px 0 0; font-size: 13px; color: ${BRAND.muted};">Our scrapbook of adorable moments</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 28px;">
        ${ctaButton("Explore Banana Meow &#10140;", frontendUrl)}
      </div>
    `,
  });

  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to the Royal Court! — Banana Meow",
    html,
    text: `Welcome to Banana Meow, ${displayName}!\n\nYour email is verified and your royal adventure begins now.\n\nWhat you can do:\n• Meet the Cats — get to know our rescued royal chonks\n• Browse the Shop — cute cat merch & accessories\n• Royal Gallery — our scrapbook of adorable moments\n\nVisit us: ${frontendUrl}\n\n— Banana Meow Team`,
  };

  return sendMailSafe(mailOptions);
}

/**
 * ✅ Password Reset Email
 * Signature: (to, name, resetUrl)
 */
export async function sendPasswordResetEmail(to, name, resetUrl) {
  const displayName = name || "there";

  const html = emailLayout({
    preheader: "Reset your Banana Meow password — this link expires soon.",
    subtitle: "Password Reset",
    body: `
      ${heading("Reset Your Password &#128274;")}
      ${para(`Hi ${displayName}, we received a request to reset your Banana Meow account password. Click the button below to choose a new one.`)}

      <div style="text-align: center; margin: 32px 0;">
        ${ctaButton("Reset My Password", resetUrl)}
      </div>

      ${infoBox(`
        <p style="margin: 0; font-size: 13px; color: #7A6520;">
          &#9200; This link will expire in <strong>1 hour</strong> for security reasons.
        </p>
      `)}

      ${divider()}

      ${para("If the button doesn't work, copy and paste this URL into your browser:", { size: "13px" })}
      <p style="margin: 0 0 16px; font-size: 12px; color: ${BRAND.mutedLight}; word-break: break-all;">${resetUrl}</p>

      ${para("If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.", { size: "13px", color: BRAND.mutedLight, margin: "0" })}
    `,
  });

  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your Password — Banana Meow",
    html,
    text: `Hi ${displayName},\n\nWe received a request to reset your Banana Meow password.\n\nReset your password here: ${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\n— Banana Meow Team`,
  };

  return sendMailSafe(mailOptions);
}

/**
 * ✅ Password Changed Notification
 * Signature: (to, name)
 */
export async function sendPasswordChangeNotification(to, name) {
  const displayName = name || "there";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const html = emailLayout({
    preheader: "Your Banana Meow password was recently changed.",
    subtitle: "Security Notice",
    body: `
      ${heading("Password Updated &#9989;")}
      ${para(`Hi ${displayName}, this is a confirmation that your Banana Meow account password was successfully changed.`)}

      ${infoBox(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="font-size: 13px; color: #7A6520; line-height: 1.6;">
              <strong>&#128197; When:</strong> ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}<br>
              <strong>&#128274; Action:</strong> Password changed
            </td>
          </tr>
        </table>
      `)}

      <div style="background: #FFF0F0; border-left: 4px solid ${BRAND.alert}; border-radius: 0 12px 12px 0; padding: 16px 20px; margin: 20px 0;">
        <p style="margin: 0; font-size: 13px; color: #8B3A3A;">
          &#9888;&#65039; <strong>Didn't make this change?</strong><br>
          If you did not change your password, please contact our support team immediately or reset your password right away.
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        ${ctaButton("Go to My Account", `${frontendUrl}/profile`)}
      </div>
    `,
  });

  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Changed — Banana Meow",
    html,
    text: `Hi ${displayName},\n\nYour Banana Meow account password was recently changed.\n\nDate: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\n\nIf you did not make this change, please contact us immediately or reset your password.\n\n— Banana Meow Team`,
  };

  return sendMailSafe(mailOptions);
}

/**
 * ✅ Order Confirmation Email
 * Signature: (to, order)
 */
export async function sendOrderConfirmationEmail(to, order) {
  const itemsRows = (order.items || [])
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid ${BRAND.border}; font-size: 14px; color: ${BRAND.ink};">${item.name || "Item"}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid ${BRAND.border}; text-align: center; font-size: 14px; color: ${BRAND.muted};">${item.quantity || 1}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid ${BRAND.border}; text-align: right; font-size: 14px; font-weight: 600; color: ${BRAND.ink};">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const totalAmount = order.total ? order.total.toFixed(2) : "0.00";

  const html = emailLayout({
    preheader: `Your Banana Meow order has been confirmed! Order #${order._id}`,
    subtitle: "Order Confirmation",
    body: `
      ${heading("Order Confirmed! &#127881;")}
      ${para("Thank you for your purchase! Your order has been received and is being processed with care.")}

      ${infoBox(`
        <p style="margin: 0; font-size: 13px; color: #7A6520;">
          <strong>Order ID:</strong> ${order._id}
        </p>
      `)}

      <!-- Items table -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; border: 1px solid ${BRAND.border}; border-radius: 12px; overflow: hidden;">
        <thead>
          <tr style="background: ${BRAND.lilac}40;">
            <th style="padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 700; color: ${BRAND.purple}; text-transform: uppercase; letter-spacing: 0.5px;">Item</th>
            <th style="padding: 10px 12px; text-align: center; font-size: 12px; font-weight: 700; color: ${BRAND.purple}; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
            <th style="padding: 10px 12px; text-align: right; font-size: 12px; font-weight: 700; color: ${BRAND.purple}; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <!-- Total -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px;">
        <tr>
          <td style="text-align: right; padding: 12px 0; border-top: 2px solid ${BRAND.purple};">
            <span style="font-size: 13px; color: ${BRAND.muted}; margin-right: 12px;">Total Paid</span>
            <span style="font-size: 22px; font-weight: 800; color: ${BRAND.purple};">$${totalAmount}</span>
          </td>
        </tr>
      </table>

      ${para("Every purchase helps support rescued cats in need. Thank you for being part of the Banana Meow family! &#128049;", { margin: "0" })}
    `,
  });

  const itemsText = (order.items || [])
    .map((i) => `  • ${i.name} x${i.quantity} — $${((i.price || 0) * (i.quantity || 1)).toFixed(2)}`)
    .join("\n");

  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Order Confirmed — Banana Meow",
    html,
    text: `Order Confirmed!\n\nOrder ID: ${order._id}\n\nItems:\n${itemsText}\n\nTotal: $${totalAmount}\n\nThank you for your purchase!\n\n— Banana Meow Team`,
  };

  return sendMailSafe(mailOptions);
}

/**
 * ✅ Donation Thank-You Email
 * Signature: (to, donation)
 */
export async function sendDonationThankYouEmail(to, donation) {
  const amount = donation.amount ? donation.amount.toFixed(2) : "0.00";
  const catName = donation.cat || "our cats";
  const donationType = donation.type || "General";
  const frequency = donation.frequency || "one-time";

  const html = emailLayout({
    preheader: `Thank you for your generous ${frequency} donation of $${amount}!`,
    subtitle: "Thank You for Your Donation",
    body: `
      ${heading("You're a Hero! &#128155;")}
      ${para(`Your generous donation has been received and will make a real difference in the lives of our rescued feline friends. Thank you for your incredible kindness!`)}

      <!-- Donation highlight -->
      <div style="text-align: center; margin: 28px 0;">
        <div style="display: inline-block; background: linear-gradient(135deg, ${BRAND.goldLight} 0%, ${BRAND.lilac}60 100%); border-radius: 20px; padding: 28px 40px;">
          <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: ${BRAND.muted};">Your Donation</p>
          <p style="margin: 0 0 8px; font-size: 36px; font-weight: 800; color: ${BRAND.purple};">$${amount}</p>
          <p style="margin: 0; font-size: 13px; color: ${BRAND.muted};">${frequency} &bull; ${donationType}</p>
        </div>
      </div>

      ${infoBox(`
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="font-size: 13px; color: #7A6520; line-height: 1.8;">
              <strong>&#128049; For:</strong> ${catName}<br>
              <strong>&#128176; Type:</strong> ${donationType}<br>
              <strong>&#128257; Frequency:</strong> ${frequency}
            </td>
          </tr>
        </table>
      `)}

      ${para("Your support helps provide food, medical care, and a safe home for rescued cats. Every dollar counts and every cat thanks you!", { margin: "0" })}
    `,
  });

  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Thank You for Your Donation! — Banana Meow",
    html,
    text: `Thank you for your generous donation!\n\nAmount: $${amount}\nFor: ${catName}\nType: ${donationType}\nFrequency: ${frequency}\n\nYour support makes a real difference in the lives of our rescued feline friends.\n\n— Banana Meow Team`,
  };

  return sendMailSafe(mailOptions);
}

/**
 * ✅ Contact Reply Email
 * Signature: (to, name, subject, reply)
 */
export async function sendContactReplyEmail(to, name, subject, reply) {
  const displayName = name || "there";
  // Sanitize reply content (preserve newlines but escape HTML)
  const safeReply = String(reply || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");

  const html = emailLayout({
    preheader: `We've responded to your inquiry: "${subject}"`,
    subtitle: "Support Response",
    body: `
      ${heading(`Hi ${displayName}! &#128075;`)}
      ${para(`We've reviewed your inquiry and here's our response regarding <strong>"${subject || "your message"}"</strong>:`)}

      <!-- Reply quote -->
      <div style="background: ${BRAND.cream}; border-left: 4px solid ${BRAND.purple}; border-radius: 0 12px 12px 0; padding: 20px 24px; margin: 24px 0;">
        <p style="margin: 0; font-size: 15px; line-height: 1.7; color: ${BRAND.ink};">${safeReply}</p>
      </div>

      ${para("If you have any more questions or need further assistance, feel free to reply to this email or submit another inquiry on our website.")}

      ${para("We're always happy to help! &#128049;", { margin: "0" })}
    `,
  });

  const mailOptions = {
    from: `"Banana Meow Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Re: ${subject || "Your Inquiry"} — Banana Meow`,
    html,
    text: `Hi ${displayName},\n\nWe've responded to your inquiry about "${subject || "your message"}":\n\n${reply}\n\nIf you have more questions, feel free to reply.\n\n— Banana Meow Support Team`,
  };

  return sendMailSafe(mailOptions);
}

/**
 * ✅ Newsletter Welcome Email
 * Signature: (to, name)
 */
export async function sendNewsletterWelcomeEmail(to, name) {
  const displayName = name || "Cat Lover";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  const html = emailLayout({
    preheader: `You're subscribed to the Banana Meow newsletter! Cute cat content incoming.`,
    subtitle: "Newsletter",
    body: `
      ${heading(`Welcome, ${displayName}! &#128140;`)}
      ${para("You've successfully subscribed to the Banana Meow newsletter! Get ready for a paw-some inbox filled with cuteness.")}

      <!-- What to expect -->
      <div style="margin: 24px 0;">
        <p style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: ${BRAND.ink};">Here's what you can look forward to:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.muted};">
              <span style="display: inline-block; width: 24px; text-align: center; margin-right: 8px;">&#128248;</span>
              Adorable cat updates and photos
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.muted};">
              <span style="display: inline-block; width: 24px; text-align: center; margin-right: 8px;">&#127873;</span>
              Exclusive deals and new products
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.muted};">
              <span style="display: inline-block; width: 24px; text-align: center; margin-right: 8px;">&#127775;</span>
              Behind-the-scenes at the cat court
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: ${BRAND.muted};">
              <span style="display: inline-block; width: 24px; text-align: center; margin-right: 8px;">&#128156;</span>
              Heartwarming rescue stories
            </td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin-top: 28px;">
        ${ctaButton("Visit Banana Meow &#10140;", frontendUrl)}
      </div>

      ${para("Stay tuned for purr-fect content delivered straight to your inbox!", { margin: "20px 0 0", size: "13px", color: BRAND.mutedLight })}
    `,
  });

  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "You're Now Subscribed to BananaMeow Updates 🐾",
    html,
    text: `Welcome to the Banana Meow Newsletter, ${displayName}!\n\nHere's what you can expect:\n• Adorable cat updates and photos\n• Exclusive deals and new products\n• Behind-the-scenes at the cat court\n• Heartwarming rescue stories\n\nVisit us: ${frontendUrl}\n\n— Banana Meow Team`,
  };

  return sendMailSafe(mailOptions);
}

/**
 * Order Receipt (placeholder – kept for import compatibility)
 */
export async function sendOrderReceipt(to, name, order) {
  // Delegates to the order confirmation email
  return sendOrderConfirmationEmail(to, order);
}
