const { sendContactEmail } = require('../Utils/mailer');

/**
 * POST /api/contact
 * Forward a contact form message to the owner's email.
 */
const contact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields (name, email, message) are required.' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }

    await sendContactEmail({ name, email, message });

    return res.status(200).json({ success: true, message: 'Your message has been sent! I\'ll get back to you shortly.' });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
};

module.exports = { contact };
