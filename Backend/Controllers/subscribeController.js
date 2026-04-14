const Subscriber = require('../Modals/Subscriber');
const { sendWelcomeEmail } = require('../Utils/mailer');

/**
 * POST /api/subscribe
 * Subscribe a new user and send a welcome email.
 */
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.active) {
        return res.status(409).json({ success: false, message: 'This email is already subscribed.' });
      }
      existing.active = true;
      await existing.save();
      await sendWelcomeEmail(email);
      return res.status(200).json({ success: true, message: 'Welcome back! Re-subscribed successfully.' });
    }

    const subscriber = new Subscriber({ email: email.toLowerCase() });
    await subscriber.save();
    await sendWelcomeEmail(email);

    return res.status(201).json({ success: true, message: 'Subscribed successfully! Welcome aboard.' });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

/**
 * POST /api/notify-subscribers
 * Notify all active subscribers about a new article.
 * Protected by a secret key in the request body.
 * Body: { secret, title, link, excerpt }
 */
const notifySubscribers = async (req, res) => {
  try {
    const { secret, title, link, excerpt } = req.body;

    if (secret !== process.env.NOTIFY_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    if (!title || !link) {
      return res.status(400).json({ success: false, message: 'Article title and link are required.' });
    }

    const subscribers = await Subscriber.find({ active: true }).select('email -_id');
    const emails = subscribers.map((s) => s.email);

    if (emails.length === 0) {
      return res.status(200).json({ success: true, message: 'No active subscribers to notify.' });
    }

    const { sendNewArticleNotification } = require('../Utils/mailer');
    await sendNewArticleNotification(emails, { title, link, excerpt: excerpt || '' });

    return res.status(200).json({
      success: true,
      message: `Notification sent to ${emails.length} subscriber(s).`,
      count: emails.length,
    });
  } catch (err) {
    console.error('Notify subscribers error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

/**
 * GET /api/subscribers (optional: view count for owner)
 */
const getSubscribers = async (req, res) => {
  try {
    const { secret } = req.query;
    if (secret !== process.env.NOTIFY_SECRET) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }
    const subscribers = await Subscriber.find({ active: true }).sort({ subscribedAt: -1 });
    return res.status(200).json({ success: true, count: subscribers.length, subscribers });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { subscribe, notifySubscribers, getSubscribers };
