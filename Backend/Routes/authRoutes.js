const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const { verifyToken } = require('../Utils/authMiddleware');

// Google Sign-In
router.post('/auth/google', authController.googleAuth);

// Standard Login
router.post('/auth/login', authController.login);

// Registration with OTP flow
router.post('/auth/send-register-otp', authController.sendRegisterOtp);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/complete-registration', authController.completeRegistration);
router.post('/auth/register', authController.register);

// Forgot Password with OTP flow
router.post('/auth/send-reset-otp', authController.sendResetOtp);
router.post('/auth/reset-password', authController.resetPassword);

// Session Verification
router.get('/auth/me', verifyToken, authController.getMe);

// Creator Guidelines Acceptance
router.post('/auth/accept-creator-guidelines', verifyToken, authController.acceptCreatorGuidelines);

module.exports = router;
