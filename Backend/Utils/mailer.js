const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// The "from" address MUST use your verified domain on Resend
// Once aeroxplore.in is verified in Resend dashboard, this will work
const FROM_ADDRESS = 'AeroXplore <newsletter@aeroxplore.in>';

/**
 * Send a welcome email to a newly subscribed user.
 */
const sendWelcomeEmail = async (toEmail) => {
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: "Welcome to AeroXplore. You're on the Manifest!",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 32px;text-align:center;border-bottom:2px solid #e2b96f;">
            <h1 style="color:#e2b96f;font-size:28px;letter-spacing:4px;margin:0;text-transform:uppercase;">AeroXplore</h1>
            <p style="color:#a0a0a0;font-size:12px;letter-spacing:2px;margin:8px 0 0;">The Premier Aviation & Aerospace Chronicle</p>
          </div>
          <div style="padding:36px 32px;">
            <h2 style="color:#ffffff;font-size:22px;margin:0 0 16px;">Thank You for Subscribing!</h2>
            <p style="color:#c0c0c0;line-height:1.7;margin:0 0 16px;">
              You're now on the manifest. Welcome aboard the AeroXplore community, your curiosity about the skies just got a dedicated inbox companion.
            </p>
            <p style="color:#c0c0c0;line-height:1.7;margin:0 0 24px;">
              From now on, every time a new article drops, be it an engineering breakdown, a defense mission deep-dive, or a space exploration exclusive, you'll be among the first to know. Stay curious, stay aloft.
            </p>
            <div style="background:#1a1a2e;border-left:4px solid #e2b96f;padding:16px 20px;border-radius:6px;margin:0 0 28px;">
              <p style="color:#e2b96f;margin:0;font-style:italic;font-size:14px;">
                "The desire to fly is an idea handed down to us by our ancestors who, in their grueling travels across trackless lands in prehistoric times, looked enviously on the birds soaring freely through space." ,  Wilbur Wright
              </p>
            </div>
            <div style="border-top:1px solid #222;padding-top:24px;text-align:center;">
              <p style="color:#888;font-size:12px;margin:0;">
                You are receiving this because you subscribed at <strong style="color:#a0a0a0;">aeroxplore.in</strong>.<br/>
                If this wasn't you, you can safely ignore this email.
              </p>
            </div>
          </div>
          <div style="background:#0a0a0a;padding:16px 32px;text-align:center;border-top:1px solid #222;">
            <p style="color:#555;font-size:11px;margin:0;">© 2026 AeroXplore · Diwakar Nagar · All Rights Reserved</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Welcome email error:', error);
    throw new Error(error.message);
  }
};

/**
 * Notify all subscribers about a new blog article.
 * Uses Resend's batch API ,  sends up to 100 emails per call, no BCC spam issues.
 * @param {string[]} emails - Array of subscriber email addresses
 * @param {object} article  - { title, link, excerpt }
 */
const sendNewArticleNotification = async (emails, article) => {
  if (!emails || emails.length === 0) return;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 32px;text-align:center;border-bottom:2px solid #e2b96f;">
          <h1 style="color:#e2b96f;font-size:28px;letter-spacing:4px;margin:0;text-transform:uppercase;">AeroXplore</h1>
          <p style="color:#a0a0a0;font-size:12px;letter-spacing:2px;margin:8px 0 0;">New Dispatch Available</p>
        </div>
        <div style="padding:36px 32px;">
          <p style="color:#a0a0a0;font-size:12px;letter-spacing:1px;margin:0 0 12px;text-transform:uppercase;">Latest Article</p>
          <h2 style="color:#ffffff;font-size:22px;margin:0 0 16px;line-height:1.4;">${article.title}</h2>
          <p style="color:#c0c0c0;line-height:1.7;margin:0 0 28px;">${article.excerpt}</p>
          <div style="text-align:center;margin:0 0 28px;">
            <a href="${article.link}" style="display:inline-block;background:linear-gradient(135deg,#e2b96f,#c9963c);color:#0a0a0a;text-decoration:none;padding:14px 36px;border-radius:6px;font-weight:700;font-size:14px;letter-spacing:1px;">
              Read Full Article →
            </a>
          </div>
          <div style="border-top:1px solid #222;padding-top:24px;">
            <p style="color:#888;font-size:12px;margin:0;text-align:center;">
              You are receiving this because you subscribed to AeroXplore dispatches.<br/>
              Visit <strong style="color:#a0a0a0;">aeroxplore.in</strong> to explore more.
            </p>
          </div>
        </div>
        <div style="background:#0a0a0a;padding:16px 32px;text-align:center;border-top:1px solid #222;">
          <p style="color:#555;font-size:11px;margin:0;">© 2026 AeroXplore · Diwakar Nagar · All Rights Reserved</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Resend batch API: send up to 100 emails per request, each addressed individually
  const BATCH_SIZE = 100;
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE).map((email) => ({
      from: FROM_ADDRESS,
      to: email,
      subject: `New on AeroXplore: ${article.title}`,
      html: emailHtml,
    }));

    const { error } = await resend.batch.send(batch);
    if (error) {
      console.error(`Batch send error (batch starting at ${i}):`, error);
      throw new Error(error.message);
    }
  }
};

/**
 * Forward a contact form message to the owner's email.
 */
const sendContactEmail = async ({ name, email, message }) => {
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: process.env.OWNER_EMAIL, // Your personal inbox to receive contact messages
    reply_to: email,
    subject: `New Message from ${name} - AeroXplore Contact`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:30px 32px;border-bottom:2px solid #e2b96f;">
            <h1 style="color:#e2b96f;font-size:20px;letter-spacing:3px;margin:0;text-transform:uppercase;">Contact Message</h1>
            <p style="color:#a0a0a0;font-size:11px;letter-spacing:1px;margin:6px 0 0;">AeroXplore.in ,  Contact Form Submission</p>
          </div>
          <div style="padding:32px;">
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr>
                <td style="color:#888;font-size:12px;padding:8px 0;border-bottom:1px solid #222;width:100px;">From</td>
                <td style="color:#fff;font-size:14px;padding:8px 0;border-bottom:1px solid #222;">${name}</td>
              </tr>
              <tr>
                <td style="color:#888;font-size:12px;padding:8px 0;border-bottom:1px solid #222;">Email</td>
                <td style="font-size:14px;padding:8px 0;border-bottom:1px solid #222;"><a href="mailto:${email}" style="color:#e2b96f;">${email}</a></td>
              </tr>
            </table>
            <h3 style="color:#a0a0a0;font-size:12px;letter-spacing:1px;margin:0 0 12px;text-transform:uppercase;">Message</h3>
            <div style="background:#1a1a2e;border-radius:8px;padding:20px;border-left:4px solid #e2b96f;">
              <p style="color:#e0e0e0;line-height:1.8;margin:0;white-space:pre-wrap;">${message}</p>
            </div>
            <p style="color:#666;font-size:12px;margin:24px 0 0;">You can reply directly to this email to respond to ${name}.</p>
          </div>
          <div style="background:#0a0a0a;padding:14px 32px;text-align:center;border-top:1px solid #222;">
            <p style="color:#555;font-size:11px;margin:0;">© 2026 AeroXplore · Back-end Contact System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Contact email error:', error);
    throw new Error(error.message);
  }
};

/**
 * Send an OTP verification email using Nodemailer (Gmail SMTP).
 * @param {string} toEmail - Recipient address
 * @param {string} otp - 6-digit One-Time Password
 * @param {string} purpose - 'register' | 'reset'
 */
const nodemailer = require('nodemailer');

let cachedTransporter = null;
const getTransporter = () => {
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.Mail,
        pass: process.env.App_Pass,
      },
    });
  }
  return cachedTransporter;
};

/**
 * Send an OTP verification email using Nodemailer (Gmail SMTP).
 * Formatted for maximum deliverability (inbox instead of spam).
 * @param {string} toEmail - Recipient address
 * @param {string} otp - 6-digit One-Time Password
 * @param {string} purpose - 'register' | 'reset'
 */
const sendOtpEmail = async (toEmail, otp, purpose = 'register') => {
  const transporter = getTransporter();
  const isRegister = purpose === 'register';

  // Standard, clean subject lines that spam filters recognize as legitimate transactional OTPs
  const subject = isRegister
    ? `${otp} is your AeroXplore verification code`
    : `${otp} is your AeroXplore password reset code`;

  const heading = isRegister ? 'Verify Your Email Address' : 'Reset Your Password';
  const description = isRegister
    ? 'Welcome to AeroXplore! Use the 6-digit verification code below to confirm your email and complete your account registration.'
    : 'A password reset was requested for your AeroXplore account. Enter the 6-digit code below to set your new password.';

  // Plain text fallback ensures emails aren't flagged as spam for being HTML-only
  const textContent = `AeroXplore - The Aviation & Aerospace Chronicle\n\n` +
    `${heading}\n\n` +
    `${description}\n\n` +
    `Verification Code: ${otp}\n\n` +
    `Note: This code expires in 5 minutes.\n\n` +
    `If you did not request this code, no action is needed.\n\n` +
    `© 2026 AeroXplore · All Rights Reserved`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#0d0d0d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f0f0f0;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0d0d0d;padding:30px 15px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:540px;background-color:#141414;border:1px solid #2d2318;border-radius:10px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.6);">
              
              <!-- Header Bar -->
              <tr>
                <td style="background:linear-gradient(135deg,#1f1a14 0%,#111111 100%);padding:30px 24px;text-align:center;border-bottom:2px solid #d4a84b;">
                  <h1 style="color:#d4a84b;font-size:22px;letter-spacing:4px;margin:0;text-transform:uppercase;font-weight:700;">AEROXPLORE</h1>
                  <p style="color:#a89984;font-size:11px;letter-spacing:2px;margin:6px 0 0;text-transform:uppercase;">Aviation &amp; Aerospace Chronicle</p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding:32px 28px;text-align:center;">
                  <h2 style="color:#ffffff;font-size:20px;margin:0 0 14px;font-weight:600;">${heading}</h2>
                  <p style="color:#b8b8b8;font-size:14px;line-height:1.6;margin:0 0 28px;">
                    ${description}
                  </p>

                  <!-- OTP Code Box -->
                  <div style="background-color:#1c1712;border:2px dashed #d4a84b;border-radius:8px;padding:20px 24px;margin:0 auto 24px;display:inline-block;min-width:240px;">
                    <div style="font-size:11px;color:#c0953a;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;font-weight:600;">Your Verification Code</div>
                    <div style="font-family:'Courier New',Courier,monospace;font-size:38px;font-weight:700;letter-spacing:8px;color:#fdfaf3;line-height:1;">
                      ${otp}
                    </div>
                  </div>

                  <!-- Expiration Alert -->
                  <p style="color:#d4a84b;font-size:13px;margin:0 0 20px;font-weight:500;">
                  Valid for 5 minutes. Do not share this code with anyone.
                  </p>

                  <p style="color:#777777;font-size:12px;line-height:1.5;margin:0;">
                    If you didn't initiate this request, you can safely ignore this email.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#0d0d0d;padding:18px 24px;text-align:center;border-top:1px solid #221c15;">
                  <p style="color:#555555;font-size:11px;margin:0;">
                    © 2026 AeroXplore · <a href="https://aeroxplore.in" style="color:#8c6721;text-decoration:none;">aeroxplore.in</a> · All Rights Reserved
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const senderEmail = process.env.Mail || 'diwakarnagar01@gmail.com';

  const mailOptions = {
    from: `"AeroXplore" <${senderEmail}>`,
    to: toEmail,
    replyTo: senderEmail,
    subject,
    text: textContent,
    html: htmlContent,
    headers: {
      'X-Priority': '1',
      'Importance': 'high',
    },
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[OTP MAILER] Successfully delivered ${purpose} OTP (${otp}) to ${toEmail} | MsgID: ${info.messageId}`);
  return info;
};

module.exports = { sendWelcomeEmail, sendNewArticleNotification, sendContactEmail, sendOtpEmail };

