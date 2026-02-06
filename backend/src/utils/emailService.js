import { Resend } from "resend";

// Initialize Resend with API key
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured - emails will not be sent");
    return null;
  }
  return new Resend(apiKey);
};

/**
 * Send verification code email
 */
export async function sendVerificationEmail(to, code, name) {
  const resend = getResend();
  
  if (!resend) {
    console.log(`[DEV] Verification code for ${to}: ${code}`);
    return { success: false, fallback: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Banana Meow <onboarding@resend.dev>",
      to: [to],
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

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(`✉️ Verification email sent to ${to} (id: ${data.id})`);
    return { success: true, id: data.id };
  } catch (err) {
    console.error("Email send failed:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send welcome email after successful registration
 */
export async function sendWelcomeEmail(to, name) {
  const resend = getResend();
  
  if (!resend) {
    console.log(`[DEV] Welcome email would be sent to ${to}`);
    return { success: false, fallback: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Banana Meow <onboarding@resend.dev>",
      to: [to],
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

    if (error) {
      console.error("Resend welcome email error:", error);
      return { success: false, error: error.message };
    }

    console.log(`✉️ Welcome email sent to ${to} (id: ${data.id})`);
    return { success: true, id: data.id };
  } catch (err) {
    console.error("Welcome email send failed:", err);
    return { success: false, error: err.message };
  }
}
