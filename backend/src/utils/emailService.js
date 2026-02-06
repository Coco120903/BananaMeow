import nodemailer from "nodemailer";

// Create Gmail SMTP transporter
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("EMAIL_USER or EMAIL_PASS not configured - emails will not be sent");
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
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[DEV] Verification code for ${to}: ${code}`);
    return { success: false, fallback: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Banana Meow 🐱" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🐱 Your Royal Verification Code - Banana Meow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF7F0;">
          <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #FFE699 0%, #EBDCF9 100%); padding: 20px; border-radius: 20px; margin-bottom: 20px;">
                <span style="font-size: 48px;">🐱</span>
              </div>
              <h1 style="color: #5A3E85; margin: 0; font-size: 28px;">Banana Meow</h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 2px;">CHONKY ROYALS</p>
            </div>

            <div style="background: white; border-radius: 24px; padding: 40px 30px; box-shadow: 0 10px 40px rgba(90, 62, 133, 0.1);">
              <h2 style="color: #5A3E85; margin: 0 0 10px 0; font-size: 22px; text-align: center;">
                Welcome to the Royal Court, ${name}!
              </h2>
              <p style="color: #666; text-align: center; margin: 0 0 30px 0; font-size: 15px; line-height: 1.6;">
                Enter this verification code to complete your registration and join our kingdom of chonky cats.
              </p>

              <div style="background: linear-gradient(135deg, #FFF9F5 0%, #EBDCF9 100%); border-radius: 16px; padding: 25px; text-align: center; margin-bottom: 30px;">
                <p style="color: #5A3E85; margin: 0 0 10px 0; font-size: 13px; font-weight: 600; letter-spacing: 1px;">YOUR VERIFICATION CODE</p>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #5A3E85; font-family: 'Courier New', monospace;">
                  ${code}
                </div>
              </div>

              <div style="background: #FDE2E4; border-radius: 12px; padding: 15px; text-align: center; margin-bottom: 25px;">
                <p style="color: #E57373; margin: 0; font-size: 13px;">
                  ⏰ This code expires in <strong>10 minutes</strong>
                </p>
              </div>

              <p style="color: #999; font-size: 12px; text-align: center; margin: 0; line-height: 1.6;">
                If you didn't request this code, please ignore this email.<br>
                Someone may have entered your email by mistake.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; margin: 0;">Made with 💜 by the Banana Meow Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to Banana Meow, ${name}!\n\nYour verification code is: ${code}\n\nThis code expires in 10 minutes.`,
    });

    console.log(`✉️ Verification email sent to ${to} (id: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send welcome email after successful registration
 */
export async function sendWelcomeEmail(to, name) {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[DEV] Welcome email would be sent to ${to}`);
    return { success: false, fallback: true };
  }

  try {
    await transporter.sendMail({
      from: `"Banana Meow 🐱" <${process.env.EMAIL_USER}>`,
      to,
      subject: "👑 Welcome to the Royal Court! - Banana Meow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FFF7F0;">
          <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #D4F5E9 0%, #EBDCF9 100%); padding: 20px; border-radius: 20px; margin-bottom: 20px;">
                <span style="font-size: 48px;">👑</span>
              </div>
              <h1 style="color: #5A3E85; margin: 0; font-size: 28px;">Welcome, ${name}!</h1>
            </div>

            <div style="background: white; border-radius: 24px; padding: 40px 30px; box-shadow: 0 10px 40px rgba(90, 62, 133, 0.1);">
              <p style="color: #666; text-align: center; margin: 0 0 25px 0; font-size: 16px; line-height: 1.7;">
                You're now officially a member of the <strong style="color: #5A3E85;">Banana Meow Royal Court</strong>!
                Our 12 British Shorthairs are honored by your presence.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cats"
                   style="display: inline-block; background: linear-gradient(135deg, #5A3E85 0%, #8B6DB3 100%); color: white; text-decoration: none; padding: 15px 35px; border-radius: 30px; font-weight: 600; font-size: 15px;">
                  Meet the Cats 🐱
                </a>
              </div>

              <p style="color: #999; font-size: 13px; text-align: center; margin: 0; line-height: 1.6;">
                Thank you for supporting our chonky royals!
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px; margin: 0;">Made with 💜 by the Banana Meow Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✉️ Welcome email sent to ${to}`);
    return { success: true };
  } catch (err) {
    console.error("Welcome email send failed:", err);
    return { success: false, error: err.message };
  }
}
