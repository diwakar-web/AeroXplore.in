const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Modals/User');
const Otp = require('../Modals/Otp');
const { sendOtpEmail } = require('../Utils/mailer');
const { isSuperUser } = require('../Utils/authMiddleware');

const getJwtSecret = () => process.env.JWT_SECRET || 'aeroxplore_jwt_secret_fallback_key';

const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    getJwtSecret(),
    { expiresIn: '30d' }
  );
};

// ── Google Sign-In / Sync with Database ─────────────────────────────────────
exports.googleAuth = async (req, res) => {
  try {
    const { email, name, photoURL, uid } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required for Google authentication.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      user.name = name || user.name;
      if (photoURL) user.photoURL = photoURL;
      if (uid) user.uid = uid;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({
        email: cleanEmail,
        name: name || '',
        photoURL: photoURL || '',
        uid: uid || '',
        authProvider: 'google',
        lastLogin: new Date(),
      });
    }

    const token = generateToken(user._id, user.email);
    const isSuper = isSuperUser(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully with Google',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        authProvider: user.authProvider,
        role: user.role,
        isSuperUser: isSuper,
        creatorGuidelinesAccepted: !!user.creatorGuidelinesAccepted,
      },
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during Google authentication.' });
  }
};

// ── 1. Send Registration OTP ───────────────────────────────────────────────
exports.sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.authProvider === 'google'
          ? 'This email was registered using Google. Please sign in with Google.'
          : 'An account with this email already exists. Please log in.',
      });
    }

    // Generate or reuse active 6-digit OTP (prevents conflicting codes across resent emails)
    let otpCode;
    const existingOtp = await Otp.findOne({ email: cleanEmail, purpose: 'register' }).sort({ createdAt: -1 });

    if (existingOtp && (Date.now() - new Date(existingOtp.createdAt).getTime()) < 90000) {
      otpCode = existingOtp.otp;
      console.log(`[AUTH] Resending active OTP (${otpCode}) to ${cleanEmail}`);
    } else {
      otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      // Store in MongoDB (auto-deletes after 5 minutes thanks to TTL index)
      await Otp.create({
        email: cleanEmail,
        otp: otpCode,
        purpose: 'register',
      });
      console.log(`[AUTH] Generated fresh OTP (${otpCode}) for ${cleanEmail}`);
    }

    // Dispatch email via Nodemailer
    await sendOtpEmail(cleanEmail, otpCode, 'register');

    return res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your Inbox and Spam/Junk folder (expires in 5 minutes).`,
    });
  } catch (err) {
    console.error('Send Register OTP Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to dispatch verification email. Please check the email address and try again.',
    });
  }
};

// ── 2. Verify OTP ──────────────────────────────────────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose = 'register' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().replace(/\D/g, '').trim();

    console.log(`[VERIFY OTP] Validating code for ${cleanEmail} (purpose: ${purpose}, input: "${cleanOtp}")`);

    const otpRecord = await Otp.findOne({
      email: cleanEmail,
      otp: cleanOtp,
      purpose,
    });

    if (!otpRecord) {
      const activeOtps = await Otp.find({ email: cleanEmail, purpose }).sort({ createdAt: -1 });
      console.warn(`[VERIFY OTP FAILED] Input: "${cleanOtp}". Active DB OTPs for ${cleanEmail}:`, activeOtps.map(o => o.otp));

      if (activeOtps.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'The verification code does not match the latest code sent to your email. Please check your latest email.',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please click "Resend Code" to receive a fresh code.',
      });
    }

    // Mark verified in record
    otpRecord.verified = true;
    await otpRecord.save();

    // Issue a short-lived verification token (10 minutes)
    const verificationToken = jwt.sign(
      { email: cleanEmail, purpose, verified: true },
      getJwtSecret(),
      { expiresIn: '10m' }
    );

    console.log(`[VERIFY OTP SUCCESS] ${cleanEmail} verified successfully.`);
    return res.status(200).json({
      success: true,
      message: 'Verification code confirmed successfully!',
      verificationToken,
    });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to verify authorization code.' });
  }
};

// ── 3. Complete Registration after OTP verification ─────────────────────────
exports.completeRegistration = async (req, res) => {
  try {
    const { name, email, password, verificationToken } = req.body;

    if (!email || !password || !verificationToken) {
      return res.status(400).json({ success: false, message: 'Email, password, and verification token are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Verify verification token
    let decoded;
    try {
      decoded = jwt.verify(verificationToken, getJwtSecret());
    } catch {
      return res.status(401).json({ success: false, message: 'Verification session expired. Please verify your email again.' });
    }

    if (decoded.email !== cleanEmail || decoded.purpose !== 'register') {
      return res.status(400).json({ success: false, message: 'Invalid verification token.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Account already exists. Please sign in.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name ? name.trim() : '',
      email: cleanEmail,
      password: hashedPassword,
      authProvider: 'jwt',
      lastLogin: new Date(),
    });

    // Delete OTP record immediately after user fills it
    await Otp.deleteMany({ email: cleanEmail, purpose: 'register' });

    const token = generateToken(newUser._id, newUser.email);
    const isSuper = isSuperUser(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome aboard.',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        photoURL: newUser.photoURL,
        authProvider: newUser.authProvider,
        role: newUser.role,
        isSuperUser: isSuper,
        creatorGuidelinesAccepted: !!newUser.creatorGuidelinesAccepted,
      },
    });
  } catch (err) {
    console.error('Complete Registration Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create account. Please try again.' });
  }
};

// ── 4. Send Forgot Password Reset OTP ───────────────────────────────────────
exports.sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your registered email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No AeroXplore account found with this email address.',
      });
    }

    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was created with Google Sign-In. Please sign in with Google.',
      });
    }

    // Generate or reuse active 6-digit OTP
    let otpCode;
    const existingOtp = await Otp.findOne({ email: cleanEmail, purpose: 'reset' }).sort({ createdAt: -1 });

    if (existingOtp && (Date.now() - new Date(existingOtp.createdAt).getTime()) < 90000) {
      otpCode = existingOtp.otp;
      console.log(`[AUTH] Resending active reset OTP (${otpCode}) to ${cleanEmail}`);
    } else {
      otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      // Store in MongoDB with 5-minute TTL
      await Otp.create({
        email: cleanEmail,
        otp: otpCode,
        purpose: 'reset',
      });
      console.log(`[AUTH] Generated fresh reset OTP (${otpCode}) for ${cleanEmail}`);
    }

    // Dispatch email
    await sendOtpEmail(cleanEmail, otpCode, 'reset');

    return res.status(200).json({
      success: true,
      message: `A password reset code has been sent to ${cleanEmail}. Please check your Inbox and Spam/Junk folder (expires in 5 minutes).`,
    });
  } catch (err) {
    console.error('Send Reset OTP Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to dispatch reset code. Please try again later.',
    });
  }
};

// ── 5. Reset Password with OTP ──────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, verification code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().replace(/\D/g, '').trim();

    // Verify OTP record
    const otpRecord = await Otp.findOne({
      email: cleanEmail,
      otp: cleanOtp,
      purpose: 'reset',
    });

    if (!otpRecord) {
      const activeOtps = await Otp.find({ email: cleanEmail, purpose: 'reset' }).sort({ createdAt: -1 });
      if (activeOtps.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'The reset code does not match the latest code sent to your email. Please check your latest email.',
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Password reset code has expired. Please request a new code.',
      });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.lastLogin = new Date();
    await user.save();

    // Delete OTP record immediately after use
    await Otp.deleteMany({ email: cleanEmail, purpose: 'reset' });

    const token = generateToken(user._id, user.email);

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully! You are now logged in.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error('Reset Password Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update password. Please try again.' });
  }
};

// ── 6. Login with Email & Password (JWT) ───────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.password && user.authProvider === 'google') {
      return res.status(400).json({
        success: false,
        message: 'This account was created with Google Sign-In. Please use the Sign in with Google option.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.email);
    const isSuper = isSuperUser(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        authProvider: user.authProvider,
        role: user.role,
        isSuperUser: isSuper,
        creatorGuidelinesAccepted: !!user.creatorGuidelinesAccepted,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

// ── 7. Legacy Register (Optional direct fallback) ──────────────────────────
exports.register = async (req, res) => {
  return exports.sendRegisterOtp(req, res);
};

// ── 8. Get Authenticated User Profile (Verify Session) ─────────────────────
exports.getMe = async (req, res) => {
  try {
    const isSuper = isSuperUser(req.user);
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        photoURL: req.user.photoURL,
        authProvider: req.user.authProvider,
        createdAt: req.user.createdAt,
        role: req.user.role,
        isSuperUser: isSuper,
        creatorGuidelinesAccepted: !!req.user.creatorGuidelinesAccepted,
        creatorGuidelinesAcceptedAt: req.user.creatorGuidelinesAcceptedAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve user profile.' });
  }
};

// ── 9. Accept Creator Warning & Caution Guidelines ─────────────────────────
exports.acceptCreatorGuidelines = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    user.creatorGuidelinesAccepted = true;
    user.creatorGuidelinesAcceptedAt = new Date();
    await user.save();

    const isSuper = isSuperUser(user);

    return res.status(200).json({
      success: true,
      message: 'AeroXplore author guidelines accepted successfully.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
        role: user.role,
        isSuperUser: isSuper,
        creatorGuidelinesAccepted: true,
        creatorGuidelinesAcceptedAt: user.creatorGuidelinesAcceptedAt,
      },
    });
  } catch (err) {
    console.error('Accept Creator Guidelines Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to record guideline acceptance. Please try again.' });
  }
};
