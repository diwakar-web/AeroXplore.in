const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.Mail,
      pass: process.env.App_Pass,
    },
  });
};

/**
 * Send a welcome email to a newly subscribed user.
 */
const sendWelcomeEmail = async (toEmail) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"AeroXplore ✈" <${process.env.Mail}>`,
    to: toEmail,
    subject: 'Welcome to AeroXplore. You\'re on the Manifest!',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 32px;text-align:center;border-bottom:2px solid #e2b96f;">
            <h1 style="color:#e2b96f;font-size:28px;letter-spacing:4px;margin:0;text-transform:uppercase;">✈ AeroXplore</h1>
            <p style="color:#a0a0a0;font-size:12px;letter-spacing:2px;margin:8px 0 0;">The Premier Aviation & Aerospace Chronicle</p>
          </div>
          <div style="padding:36px 32px;">
            <h2 style="color:#ffffff;font-size:22px;margin:0 0 16px;">Thank You for Subscribing! 🛫</h2>
            <p style="color:#c0c0c0;line-height:1.7;margin:0 0 16px;">
              You're now on the manifest. Welcome aboard the AeroXplore community, your curiosity about the skies just got a dedicated inbox companion.
            </p>
            <p style="color:#c0c0c0;line-height:1.7;margin:0 0 24px;">
              From now on, every time a new article drops, be it an engineering breakdown, a defense mission deep-dive, or a space exploration exclusive, you'll be among the first to know. Stay curious, stay aloft.
            </p>
            <div style="background:#1a1a2e;border-left:4px solid #e2b96f;padding:16px 20px;border-radius:6px;margin:0 0 28px;">
              <p style="color:#e2b96f;margin:0;font-style:italic;font-size:14px;">
                "The desire to fly is an idea handed down to us by our ancestors who, in their grueling travels across trackless lands in prehistoric times, looked enviously on the birds soaring freely through space." — Wilbur Wright
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
};

/**
 * Notify all subscribers about a new blog article.
 * @param {string[]} emails - Array of subscriber emails
 * @param {object} article - { title, link, excerpt }
 */
const sendNewArticleNotification = async (emails, article) => {
  if (!emails || emails.length === 0) return;
  const transporter = createTransporter();

  const mailOptions = {
    from: `"AeroXplore ✈" <${process.env.Mail}>`,
    bcc: emails,
    subject: 'New Article available on Aeroxplore.in, click here to read it..',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 32px;text-align:center;border-bottom:2px solid #e2b96f;">
            <h1 style="color:#e2b96f;font-size:28px;letter-spacing:4px;margin:0;text-transform:uppercase;">✈ AeroXplore</h1>
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
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Forward a contact form message to the owner's email.
 */
const sendContactEmail = async ({ name, email, message }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"AeroXplore Contact Form" <${process.env.Mail}>`,
    to: process.env.Mail,
    replyTo: email,
    subject: `✉️ New Message from ${name} — AeroXplore Contact`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:30px 32px;border-bottom:2px solid #e2b96f;">
            <h1 style="color:#e2b96f;font-size:20px;letter-spacing:3px;margin:0;text-transform:uppercase;">✉️ Contact Message</h1>
            <p style="color:#a0a0a0;font-size:11px;letter-spacing:1px;margin:6px 0 0;">AeroXplore.in — Contact Form Submission</p>
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
};

module.exports = { sendWelcomeEmail, sendNewArticleNotification, sendContactEmail };
