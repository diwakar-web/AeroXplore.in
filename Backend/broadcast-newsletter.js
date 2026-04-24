// broadcast-newsletter.js
// ============================================================
// HOW TO USE: Every week, edit the 3 values below, then run:
//   node broadcast-newsletter.js
// ============================================================

// ✏️ EDIT THESE 3 LINES EVERY WEEK:
const ARTICLE_TITLE   = "The Kandahar Crisis: A Turning Point in Aviation Security";
const ARTICLE_LINK    = "https://www.aeroxplore.in/blog/ic-814";
const ARTICLE_EXCERPT = "In our latest deep dive, we revisit the 1999 Kandahar Hijacking, a defining moment in India’s defense history. From the critical minutes on the tarmac at Amritsar to the grueling negotiations in Taliban-controlled Afghanistan, we explore the tactical failures and the impossible choices that faced the nation.";

// ============================================================
// DO NOT EDIT BELOW THIS LINE
// ============================================================
require('dotenv').config();
const mongoose = require('mongoose');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_ADDRESS = 'AeroXplore ✈ <newsletter@aeroxplore.in>';

// Inline the Subscriber model so this script is self-contained
const subscriberSchema = new mongoose.Schema({ email: String, active: Boolean });
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

async function sendNewsletter() {
  if (!ARTICLE_TITLE || ARTICLE_TITLE === "Your Article Title Here") {
    console.error('❌ Please set ARTICLE_TITLE, ARTICLE_LINK, and ARTICLE_EXCERPT before running!');
    process.exit(1);
  }

  console.log(`\n🚀 Starting newsletter blast for: "${ARTICLE_TITLE}"`);
  console.log('⏳ Connecting to MongoDB...');

  await mongoose.connect(process.env.Mongo_DB);
  console.log('✅ Connected to MongoDB.');

  const subscribers = await Subscriber.find({ active: true }).select('email -_id');
  const emails = subscribers.map((s) => s.email);

  if (emails.length === 0) {
    console.log('ℹ️  No active subscribers found. Exiting.');
    await mongoose.disconnect();
    return;
  }

  console.log(`📬 Found ${emails.length} subscriber(s). Sending emails via Resend...`);

  const emailHtml = `
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
          <h2 style="color:#ffffff;font-size:22px;margin:0 0 16px;line-height:1.4;">${ARTICLE_TITLE}</h2>
          <p style="color:#c0c0c0;line-height:1.7;margin:0 0 28px;">${ARTICLE_EXCERPT}</p>
          <div style="text-align:center;margin:0 0 28px;">
            <a href="${ARTICLE_LINK}" style="display:inline-block;background:linear-gradient(135deg,#e2b96f,#c9963c);color:#0a0a0a;text-decoration:none;padding:14px 36px;border-radius:6px;font-weight:700;font-size:14px;letter-spacing:1px;">
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

  // Send in batches of 100 (Resend batch limit)
  const BATCH_SIZE = 100;
  let totalSent = 0;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE).map((email) => ({
      from: FROM_ADDRESS,
      to: email,
      subject: `New on AeroXplore: ${ARTICLE_TITLE}`,
      html: emailHtml,
    }));

    const { data, error } = await resend.batch.send(batch);

    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    } else {
      totalSent += batch.length;
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1} sent — ${batch.length} emails delivered.`);
    }
  }

  console.log(`\n🎉 Done! Newsletter sent to ${totalSent}/${emails.length} subscriber(s).`);
  await mongoose.disconnect();
}

sendNewsletter().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
