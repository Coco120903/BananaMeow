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

  // Primary: try SMTPS (465)
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

    // Retry using explicit STARTTLS (587) on socket errors
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
        console.error("Fallback SMTP send also failed:", err2?.message || err2);

        // If TLS error due to self-signed cert, optionally retry once with insecure TLS
        const msg = (err2?.message || "").toLowerCase();
        if (msg.includes("self-signed") || msg.includes("self signed certificate") || msg.includes("certificate")) {
          try {
            console.warn("Retrying fallback SMTP with relaxed TLS (self-signed certificate detected)");
            const fallbackInsecure = createTransporter({
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              allowInsecure: true,
              forceIPv4,
            });
            const info3 = await fallbackInsecure.sendMail(mailOptions);
            return { success: true, messageId: info3.messageId };
          } catch (err3) {
            console.error("Fallback (insecure) SMTP send also failed:", err3?.message || err3);
            return { success: false, error: err3?.message || String(err3) };
          }
        }

        return { success: false, error: err2?.message || String(err2) };
      }
    }

    return { success: false, error: err?.message || String(err) };
  }
}

function formatCurrency(n) {
  return (Number(n) || 0).toFixed(2);
}

/**
 * ✅ UPDATED: Polished “real receipt” style + "we’ll keep you updated" + table breakdown
 * Drop-in replacement for your old sendOrderReceipt.
 */
export async function sendOrderReceipt(to, name, order) {
  const money = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n) || 0);

  const brand = "Banana Meow";
  const supportEmail = process.env.EMAIL_USER || "support@example.com";

  const orderNumber = order?.orderNumber || order?._id || `BM-${Date.now()}`;
  const placedAt = order?.createdAt ? new Date(order.createdAt) : new Date();
  const placedAtText = placedAt.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const items = Array.isArray(order?.items) ? order.items : [];
  const subtotal =
    order?.subtotal ??
    items.reduce((sum, i) => sum + (Number(i?.price) || 0) * (Number(i?.quantity) || 1), 0);

  const shipping = Number(order?.shippingFee || order?.shipping || 0);
  const discount = Number(order?.discount || 0);
  const tax = Number(order?.tax || 0);

  const computedTotal = subtotal + shipping + tax - discount;
  const total = Number(order?.total ?? computedTotal);

  const paymentLabel =
    order?.paymentStatus === "paid"
      ? "Paid"
      : order?.paymentStatus
      ? String(order.paymentStatus).toUpperCase()
      : order?.isPaid
      ? "Paid"
      : "Pending";

  const rowsHtml = items
    .map((i) => {
      const qty = Number(i?.quantity) || 1;
      const unit = Number(i?.price) || 0;
      const line = unit * qty;
      const sku = i?.sku
        ? `<div style="font-size:12px;color:#6b7280; margin-top:2px;">SKU: ${i.sku}</div>`
        : "";

      return `
        <tr>
          <td style="padding:12px 0; border-bottom:1px solid #f0f2f5;">
            <div style="font-weight:600; color:#111827;">${i?.name || "Item"}</div>
            ${sku}
          </td>
          <td align="center" style="padding:12px 0; border-bottom:1px solid #f0f2f5; color:#111827;">${qty}</td>
          <td align="right" style="padding:12px 0; border-bottom:1px solid #f0f2f5; color:#111827;">${money(unit)}</td>
          <td align="right" style="padding:12px 0; border-bottom:1px solid #f0f2f5; font-weight:600; color:#111827;">${money(line)}</td>
        </tr>
      `;
    })
    .join("");

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0; padding:0; background:#f6f7fb;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Order received — we’ll keep you posted as we process your order.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:600px; max-width:600px;">
            <tr>
              <td style="padding:18px 18px 10px 18px;">
                <div style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-weight:800; font-size:18px; color:#111827;">
                  ${brand}
                </div>
                <div style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:12px; color:#6b7280; margin-top:4px;">
                  Official Receipt / Order Confirmation
                </div>
              </td>
            </tr>

            <tr>
              <td style="background:#ffffff; border-radius:14px; box-shadow:0 6px 20px rgba(17,24,39,0.06); padding:22px;">
                <div style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:22px; font-weight:800; color:#111827; margin-bottom:6px;">
                  Thank you for your purchase${name ? `, ${name}` : ""}! 💛
                </div>

                <div style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:14px; color:#374151; line-height:1.6;">
                  We’ve received your order and we’re getting it ready.
                  <strong>We’ll keep you updated</strong> with the next steps (processing, shipping, and delivery).
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                  style="margin-top:16px; background:#f9fafb; border:1px solid #eef0f4; border-radius:12px; padding:14px;">
                  <tr>
                    <td style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:13px; color:#6b7280;">
                      <div style="margin-bottom:6px;"><span style="color:#111827; font-weight:700;">Order #</span> ${orderNumber}</div>
                      <div style="margin-bottom:6px;"><span style="color:#111827; font-weight:700;">Placed</span> ${placedAtText}</div>
                      <div><span style="color:#111827; font-weight:700;">Payment</span> ${paymentLabel}</div>
                    </td>
                    <td align="right" style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:13px; color:#6b7280;">
                      <div style="font-size:12px; margin-bottom:6px;">Receipt Total</div>
                      <div style="font-size:20px; font-weight:900; color:#111827;">${money(total)}</div>
                    </td>
                  </tr>
                </table>

                <div style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:14px; font-weight:800; color:#111827; margin-top:18px;">
                  Receipt Details
                </div>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:10px;">
                  <tr>
                    <th align="left" style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:12px; color:#6b7280; font-weight:700; padding:10px 0; border-bottom:1px solid #eef0f4;">Item</th>
                    <th align="center" style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:12px; color:#6b7280; font-weight:700; padding:10px 0; border-bottom:1px solid #eef0f4;">Qty</th>
                    <th align="right" style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:12px; color:#6b7280; font-weight:700; padding:10px 0; border-bottom:1px solid #eef0f4;">Unit</th>
                    <th align="right" style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:12px; color:#6b7280; font-weight:700; padding:10px 0; border-bottom:1px solid #eef0f4;">Amount</th>
                  </tr>
                  ${rowsHtml || `
                    <tr>
                      <td colspan="4" style="padding:14px 0; font-family:Segoe UI, Tahoma, Arial, sans-serif; color:#6b7280;">
                        (No items found on this order.)
                      </td>
                    </tr>
                  `}
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:14px;">
                  <tr>
                    <td></td>
                    <td style="width:260px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                        style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:13px; color:#374151;">
                        <tr>
                          <td style="padding:6px 0;">Subtotal</td>
                          <td align="right" style="padding:6px 0; font-weight:700; color:#111827;">${money(subtotal)}</td>
                        </tr>
                        ${shipping ? `
                        <tr>
                          <td style="padding:6px 0;">Shipping</td>
                          <td align="right" style="padding:6px 0; font-weight:700; color:#111827;">${money(shipping)}</td>
                        </tr>` : ""}
                        ${tax ? `
                        <tr>
                          <td style="padding:6px 0;">Tax</td>
                          <td align="right" style="padding:6px 0; font-weight:700; color:#111827;">${money(tax)}</td>
                        </tr>` : ""}
                        ${discount ? `
                        <tr>
                          <td style="padding:6px 0;">Discount</td>
                          <td align="right" style="padding:6px 0; font-weight:700; color:#111827;">- ${money(discount)}</td>
                        </tr>` : ""}
                        <tr>
                          <td style="padding:10px 0; border-top:1px solid #eef0f4; font-size:14px; font-weight:900; color:#111827;">Total</td>
                          <td align="right" style="padding:10px 0; border-top:1px solid #eef0f4; font-size:14px; font-weight:900; color:#111827;">${money(total)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <div style="margin-top:16px; padding:14px; border-radius:12px; background:#fff7ed; border:1px solid #ffedd5;">
                  <div style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-weight:800; color:#9a3412; margin-bottom:6px;">
                    What happens next?
                  </div>
                  <div style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:13px; color:#7c2d12; line-height:1.6;">
                    • We’ll confirm your order and start processing it.<br/>
                    • You’ll receive updates when it’s shipped / ready for delivery.<br/>
                    • Need help? Just reply to this email — we’re here for you.
                  </div>
                </div>

                <div style="font-family:Segoe UI, Tahoma, Arial, sans-serif; font-size:12px; color:#6b7280; margin-top:18px; line-height:1.6;">
                  Questions? Reply to this email or contact <strong>${supportEmail}</strong>.<br/>
                  <span style="color:#9ca3af;">This receipt was generated automatically.</span>
                </div>
              </td>
            </tr>

            <tr><td style="height:18px;"></td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order received — ${brand} Receipt (${orderNumber})`,
    html,
    text:
      `Order received — ${brand}\n` +
      `Order #: ${orderNumber}\n` +
      `Placed: ${placedAtText}\n` +
      `Payment: ${paymentLabel}\n\n` +
      `Items:\n` +
      items
        .map(
          (i) =>
            `- ${i?.name} x${i?.quantity} @ ${money(i?.price)} = ${money((i?.price || 0) * (i?.quantity || 1))}`
        )
        .join("\n") +
      `\n\nSubtotal: ${money(subtotal)}` +
      (shipping ? `\nShipping: ${money(shipping)}` : "") +
      (tax ? `\nTax: ${money(tax)}` : "") +
      (discount ? `\nDiscount: -${money(discount)}` : "") +
      `\nTotal: ${money(total)}\n\n` +
      `We’ll keep you updated with the next steps. If you have questions, reply to this email.`,
  };

  const result = await sendMailSafe(mailOptions);

  if (result.fallback) {
    console.log(`[DEV] Order receipt for ${to}: total ${money(total)} (order: ${orderNumber})`);
    return { success: false, fallback: true };
  }
  if (result.success) {
    console.log(`✉️ Order receipt sent to ${to} (id: ${result.messageId})`);
    return { success: true, messageId: result.messageId };
  }
  console.error("Order receipt send failed:", result.error);
  return { success: false, error: result.error };
}

export async function sendDonationReceipt(to, name, donation) {
  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Thank you for your donation to Banana Meow`,
    html:
      `<!doctype html><html><body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:20px;">` +
      `<div style="max-width:600px;margin:0 auto;">` +
      `<h2>Thank you for your donation${name ? `, ${name}` : ""}!</h2>` +
      `<p>We received your ${donation.frequency || "donation"} of <strong>$${formatCurrency(donation.amount)}</strong>.</p>` +
      `<p>Your support helps our cats — we appreciate it!</p>` +
      `</div></body></html>`,
    text: `Thank you for your donation of $${formatCurrency(donation.amount)}.`,
  };

  const result = await sendMailSafe(mailOptions);
  if (result.fallback) {
    console.log(`[DEV] Donation receipt for ${to}: $${formatCurrency(donation.amount)}`);
    return { success: false, fallback: true };
  }
  if (result.success) {
    console.log(`✉️ Donation receipt sent to ${to} (id: ${result.messageId})`);
    return { success: true, messageId: result.messageId };
  }
  console.error("Donation receipt send failed:", result.error);
  return { success: false, error: result.error };
}

export async function sendVerificationEmail(to, code, name) {
  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Banana Meow verification code",
    html:
      `<!doctype html><html><body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:20px;">` +
      `<div style="max-width:500px;margin:0 auto;">` +
      `<h2>Hello${name ? `, ${name}` : ""}!</h2>` +
      `<p>Your verification code is:</p>` +
      `<p style="font-size:28px; font-weight:700; letter-spacing:4px;">${code}</p>` +
      `<p>This code expires in 10 minutes.</p>` +
      `</div></body></html>`,
    text: `Your verification code is: ${code} (expires in 10 minutes)`,
  };

  const result = await sendMailSafe(mailOptions);
  if (result.fallback) {
    console.log(`[DEV] Verification code for ${to}: ${code}`);
    return { success: false, fallback: true };
  }
  if (result.success) return { success: true, messageId: result.messageId };
  return { success: false, error: result.error };
}

export async function sendWelcomeEmail(to, name) {
  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Welcome to Banana Meow${name ? `, ${name}` : ""}!`,
    html:
      `<!doctype html><html><body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:20px; background:#FFF7F0;">` +
      `<div style="max-width:500px;margin:0 auto; padding:20px;">` +
      `<h1 style="color:#5A3E85;">Welcome${name ? `, ${name}` : ""}!</h1>` +
      `<p>Thanks for joining the Banana Meow Royal Court — meet our cats at the site.</p>` +
      `</div></body></html>`,
    text: `Welcome to Banana Meow${name ? `, ${name}` : ""}!`,
  };

  const result = await sendMailSafe(mailOptions);
  if (result.fallback) {
    console.log(`[DEV] Welcome email would be sent to ${to}`);
    return { success: false, fallback: true };
  }
  if (result.success) return { success: true, messageId: result.messageId };
  return { success: false, error: result.error };
}

export async function sendPasswordResetEmail(to, name, resetUrl) {
  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔒 Reset Your Password - Banana Meow",
    html:
      `<!doctype html><html><body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:20px; background:#fef9e7;">` +
      `<div style="max-width:500px;margin:0 auto; padding:20px;">` +
      `<h2>Hello${name ? `, ${name}` : ""}!</h2>` +
      `<p>We received a request to reset your password. Click the button below to create a new password:</p>` +
      `<div style="text-align:center;margin:20px 0;"><a href="${resetUrl}" style="background:#7c3aed;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Reset Password</a></div>` +
      `<p>If you didn't request this, ignore this email.</p>` +
      `</div></body></html>`,
    text: `Reset your password: ${resetUrl}`,
  };

  const result = await sendMailSafe(mailOptions);
  if (result.fallback) {
    console.log(`[DEV] Password reset email for ${to}: ${resetUrl}`);
    return { success: false, fallback: true };
  }
  if (result.success) return { success: true, messageId: result.messageId };
  return { success: false, error: result.error };
}

export async function sendPasswordChangeNotification(to, name) {
  const mailOptions = {
    from: `"Banana Meow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🔒 Password Updated - Banana Meow",
    html:
      `<!doctype html><html><body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:20px; background:#fef9e7;">` +
      `<div style="max-width:500px;margin:0 auto; padding:20px;">` +
      `<h2>Password Updated Successfully 🔒</h2>` +
      `<p>Hello ${name},</p>` +
      `<p>This is a confirmation that your password has been successfully updated on your Banana Meow account.</p>` +
      `<p>If you did not make this change, please contact us immediately to secure your account.</p>` +
      `</div></body></html>`,
    text: `Your password was updated successfully. If you did not make this change, contact support.`,
  };

  const result = await sendMailSafe(mailOptions);
  if (result.fallback) {
    console.log(`[DEV] Password change notification would be sent to ${to}`);
    return { success: false, fallback: true };
  }
  if (result.success) return { success: true, messageId: result.messageId };
  return { success: false, error: result.error };
}
