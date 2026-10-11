import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.webp';
import '../CSS/Login.css';

export default function Login() {
  // mode: 'signin' | 'register' | 'forgot'
  const [mode, setMode] = useState('signin');

  // Multi-step states
  // Registration: 1 (Email) -> 2 (OTP) -> 3 (Password)
  const [regStep, setRegStep] = useState(1);
  // Forgot Password: 1 (Email) -> 2 (OTP & New Password)
  const [resetStep, setResetStep] = useState(1);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [verificationToken, setVerificationToken] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Countdown timer for 5-minute OTP validity
  const [countdown, setCountdown] = useState(300); // 300 seconds = 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  const {
    isAuthenticated,
    loginWithGoogle,
    loginWithEmail,
    sendRegisterOtp,
    verifyOtp,
    completeRegistration,
    sendResetOtp,
    resetPassword,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Countdown timer effect for OTP expiration
  useEffect(() => {
    let timer;
    if ((mode === 'register' && regStep === 2) || (mode === 'forgot' && resetStep === 2)) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, regStep, resetStep]);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0 && !canResend) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown, canResend]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleOtpChange = (e) => {
    // Strip non-digits and keep up to 6 digits (supports copy-paste with spaces or hyphens)
    const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, otp: clean }));
    if (error) setError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccessMsg('');
    setRegStep(1);
    setResetStep(1);
    setFormData((prev) => ({
      ...prev,
      password: '',
      confirmPassword: '',
      otp: '',
      newPassword: '',
      confirmNewPassword: '',
    }));
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError('');
    setSuccessMsg('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Google Sign In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else {
        setError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Standard Login ─────────────────────────────────────────────────────────
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setSubmitting(true);
    try {
      await loginWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Registration: Step 1 (Send OTP) ────────────────────────────────────────
  const handleRegisterStep1 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const email = formData.email.trim();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await sendRegisterOtp(email);
      setSuccessMsg(data.message || `Verification code dispatched to ${email}`);
      setRegStep(2);
      setCountdown(300); // 5 minutes
      setCanResend(false);
      setResendCooldown(30);
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Registration: Step 2 (Verify OTP) ──────────────────────────────────────
  const handleRegisterStep2 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const email = formData.email.trim();
    const otp = formData.otp.trim();

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    if (countdown <= 0) {
      setError('Verification code has expired. Please request a new code.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await verifyOtp(email, otp, 'register');
      setVerificationToken(data.verificationToken);
      setSuccessMsg('Email verified successfully! Now set your account password.');
      setRegStep(3);
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Registration: Step 3 (Set Password & Complete) ─────────────────────────
  const handleRegisterStep3 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const email = formData.email.trim();
    const { name, password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
      setError('Please enter and confirm your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setSubmitting(true);
    try {
      await completeRegistration(name, email, password, verificationToken);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to complete account registration.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Resend Registration OTP ────────────────────────────────────────────────
  const handleResendRegisterOtp = async () => {
    if (!canResend) return;
    setError('');
    setSuccessMsg('');
    setSubmitting(true);
    try {
      await sendRegisterOtp(formData.email.trim());
      setSuccessMsg('A fresh verification code has been dispatched to your email.');
      setCountdown(300);
      setCanResend(false);
      setResendCooldown(30);
    } catch (err) {
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Forgot Password: Step 1 (Send Reset OTP) ───────────────────────────────
  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const email = formData.email.trim();
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await sendResetOtp(email);
      setSuccessMsg(data.message || `Authorization code sent to ${email}`);
      setResetStep(2);
      setCountdown(300);
      setCanResend(false);
      setResendCooldown(30);
    } catch (err) {
      setError(err.message || 'No account found with this email.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Forgot Password: Step 2 (Verify OTP & Reset Password) ───────────────────
  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const email = formData.email.trim();
    const otp = formData.otp.trim();
    const { newPassword, confirmNewPassword } = formData;

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit authorization code sent to your email.');
      return;
    }

    if (!newPassword || !confirmNewPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (countdown <= 0) {
      setError('Authorization code has expired. Please request a new code.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(email, otp, newPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Resend Reset OTP ───────────────────────────────────────────────────────
  const handleResendResetOtp = async () => {
    if (!canResend) return;
    setError('');
    setSuccessMsg('');
    setSubmitting(true);
    try {
      await sendResetOtp(formData.email.trim());
      setSuccessMsg('A new reset authorization code has been dispatched.');
      setCountdown(300);
      setCanResend(false);
      setResendCooldown(30);
    } catch (err) {
      setError(err.message || 'Failed to resend authorization code.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen-root">
      <div className="login-backdrop-overlay" />

      <div className="login-container">
        {/* Back link */}
        <Link to="/" className="login-back-link" id="login-return-home">
          ← Return to AeroXplore
        </Link>

        {/* Card Box */}
        <div className="login-card">
          {/* Card Masthead */}
          <div className="login-card-header">
            <div className="login-card-rule thick" />
            <div className="login-card-rule thin" />
            <img src={logo} alt="AeroXplore" className="login-card-logo" />
            <p className="login-card-tagline">
              {mode === 'forgot'
                ? 'Security & Password Recovery Terminal'
                : 'Aviator Authentication Dispatch'}
            </p>
            <div className="login-card-rule thin" />
          </div>

          {/* Mode Tabs (Sign In / Create Account) */}
          {mode !== 'forgot' && (
            <div className="login-tabs">
              <button
                type="button"
                className={`login-tab ${mode === 'signin' ? 'active' : ''}`}
                onClick={() => switchMode('signin')}
                id="tab-signin"
              >
                Sign In
              </button>
              <button
                type="button"
                className={`login-tab ${mode === 'register' ? 'active' : ''}`}
                onClick={() => switchMode('register')}
                id="tab-register"
              >
                Create Account
              </button>
            </div>
          )}

          {/* Alerts */}
          {error && (
            <div className="login-error-alert" role="alert">
              <span className="login-error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="login-success-alert" role="status">
              <span className="login-success-icon">✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* 1. SIGN IN MODE                                                   */}
          {/* ================================================================= */}
          {mode === 'signin' && (
            <>
              {/* Google Sign-In */}
              <button
                type="button"
                className="login-google-btn"
                onClick={handleGoogleSignIn}
                disabled={submitting}
                id="google-signin-btn"
              >
                <svg className="google-icon" width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="login-divider-row">
                <div className="login-divider-line" />
                <span className="login-divider-label">OR SIGN IN WITH EMAIL</span>
                <div className="login-divider-line" />
              </div>

              {/* Standard Email/Password Form */}
              <form className="login-form" onSubmit={handleSignInSubmit} noValidate>
                <div className="login-field">
                  <label htmlFor="login-email" className="login-label">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="aviator@aeroxplore.in"
                    value={formData.email}
                    onChange={handleChange}
                    className="login-input"
                    required
                    autoComplete="email"
                    disabled={submitting}
                  />
                </div>

                <div className="login-field">
                  <div className="login-label-row">
                    <label htmlFor="login-password" className="login-label">
                      Password
                    </label>
                    <button
                      type="button"
                      className="login-forgot-link"
                      onClick={() => switchMode('forgot')}
                      id="link-forgot-password"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="login-input"
                    required
                    autoComplete="current-password"
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  className="login-submit-btn"
                  id="login-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? <span className="login-spinner" /> : 'Sign In'}
                </button>
              </form>
            </>
          )}

          {/* ================================================================= */}
          {/* 2. CREATE ACCOUNT MODE (Step-by-Step with OTP)                   */}
          {/* ================================================================= */}
          {mode === 'register' && (
            <div className="login-step-container">
              {/* Step indicator header */}
              <div className="login-step-tracker">
                <div className={`step-dot ${regStep >= 1 ? 'active' : ''} ${regStep > 1 ? 'done' : ''}`}>
                  <span>1</span>
                </div>
                <div className={`step-line ${regStep >= 2 ? 'active' : ''}`} />
                <div className={`step-dot ${regStep >= 2 ? 'active' : ''} ${regStep > 2 ? 'done' : ''}`}>
                  <span>2</span>
                </div>
                <div className={`step-line ${regStep >= 3 ? 'active' : ''}`} />
                <div className={`step-dot ${regStep >= 3 ? 'active' : ''}`}>
                  <span>3</span>
                </div>
              </div>

              {/* STEP 1: Enter Name & Email */}
              {regStep === 1 && (
                <form className="login-form" onSubmit={handleRegisterStep1} noValidate>
                  <p className="login-step-desc">
                    Enter your email to receive a 6-digit authorization code.
                  </p>

                  <div className="login-field">
                    <label htmlFor="register-name" className="login-label">
                      Aviator Full Name (Optional)
                    </label>
                    <input
                      id="register-name"
                      type="text"
                      name="name"
                      placeholder="e.g. Diwakar Nagar"
                      value={formData.name}
                      onChange={handleChange}
                      className="login-input"
                      autoComplete="name"
                      disabled={submitting}
                    />
                  </div>

                  <div className="login-field">
                    <label htmlFor="register-email" className="login-label">
                      Email Address <span className="req-star">*</span>
                    </label>
                    <input
                      id="register-email"
                      type="email"
                      name="email"
                      placeholder="aviator@aeroxplore.in"
                      value={formData.email}
                      onChange={handleChange}
                      className="login-input"
                      required
                      autoComplete="email"
                      disabled={submitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="login-submit-btn"
                    id="btn-send-register-otp"
                    disabled={submitting}
                  >
                    {submitting ? <span className="login-spinner" /> : 'Send Verification Code →'}
                  </button>
                </form>
              )}

              {/* STEP 2: Enter 6-digit OTP */}
              {regStep === 2 && (
                <form className="login-form" onSubmit={handleRegisterStep2} noValidate>
                  <div className="login-otp-header">
                    <p className="login-step-desc">
                      A 6-digit authorization code was dispatched to:
                      <strong className="login-target-email"> {formData.email}</strong>
                    </p>
                    <button
                      type="button"
                      className="login-change-email-btn"
                      onClick={() => setRegStep(1)}
                    >
                      Change Email
                    </button>
                  </div>

                  <div className="login-field">
                    <label htmlFor="register-otp" className="login-label">
                      6-Digit Authorization Code
                    </label>
                    <input
                      id="register-otp"
                      type="text"
                      name="otp"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={7}
                      placeholder="• • • • • •"
                      value={formData.otp}
                      onChange={handleOtpChange}
                      className="login-input login-otp-input"
                      required
                      autoFocus
                      autoComplete="one-time-code"
                      disabled={submitting}
                    />
                  </div>

                  <div className="login-timer-row">
                    <span className="login-timer-text">
                      Code expires in:{' '}
                      <strong className={countdown < 60 ? 'timer-urgent' : ''}>
                        {formatTimer(countdown)}
                      </strong>
                    </span>
                    <button
                      type="button"
                      className="login-resend-btn"
                      onClick={handleResendRegisterOtp}
                      disabled={!canResend || submitting}
                    >
                      {canResend ? 'Resend Code' : `Resend in ${resendCooldown}s`}
                    </button>
                  </div>

                  <p className="login-spam-hint">
                    <strong>Can't find the email?</strong> Please check your <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> folder.
                  </p>

                  <button
                    type="submit"
                    className="login-submit-btn"
                    id="btn-verify-register-otp"
                    disabled={submitting}
                  >
                    {submitting ? <span className="login-spinner" /> : 'Verify Code →'}
                  </button>
                </form>
              )}

              {/* STEP 3: Enter Password and Complete Registration */}
              {regStep === 3 && (
                <form className="login-form" onSubmit={handleRegisterStep3} noValidate>
                  <p className="login-step-desc">
                    Email verified! Now set a secure password for your aviator account.
                  </p>

                  <div className="login-field">
                    <label htmlFor="register-password" className="login-label">
                      Create Password <span className="req-star">*</span>
                    </label>
                    <input
                      id="register-password"
                      type="password"
                      name="password"
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className="login-input"
                      required
                      autoComplete="new-password"
                      disabled={submitting}
                    />
                  </div>

                  <div className="login-field">
                    <label htmlFor="register-confirm-password" className="login-label">
                      Confirm Password <span className="req-star">*</span>
                    </label>
                    <input
                      id="register-confirm-password"
                      type="password"
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="login-input"
                      required
                      autoComplete="new-password"
                      disabled={submitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="login-submit-btn"
                    id="btn-complete-registration"
                    disabled={submitting}
                  >
                    {submitting ? <span className="login-spinner" /> : 'Complete Registration & Launch'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* 3. FORGOT PASSWORD MODE                                           */}
          {/* ================================================================= */}
          {mode === 'forgot' && (
            <div className="login-step-container">
              <div className="login-forgot-header">
                <h3 className="login-section-title">Password Recovery</h3>
                <button
                  type="button"
                  className="login-back-to-signin"
                  onClick={() => switchMode('signin')}
                >
                  ← Back to Sign In
                </button>
              </div>

              {/* FORGOT STEP 1: Enter Email */}
              {resetStep === 1 && (
                <form className="login-form" onSubmit={handleForgotStep1} noValidate>
                  <p className="login-step-desc">
                    Enter your registered email address. We will dispatch a 6-digit authorization code to verify your identity.
                  </p>

                  <div className="login-field">
                    <label htmlFor="forgot-email" className="login-label">
                      Registered Email Address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      name="email"
                      placeholder="aviator@aeroxplore.in"
                      value={formData.email}
                      onChange={handleChange}
                      className="login-input"
                      required
                      autoComplete="email"
                      disabled={submitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="login-submit-btn"
                    id="btn-send-reset-otp"
                    disabled={submitting}
                  >
                    {submitting ? <span className="login-spinner" /> : 'Send Reset Code →'}
                  </button>
                </form>
              )}

              {/* FORGOT STEP 2: Enter OTP & New Password */}
              {resetStep === 2 && (
                <form className="login-form" onSubmit={handleForgotStep2} noValidate>
                  <div className="login-otp-header">
                    <p className="login-step-desc">
                      Enter the 6-digit code sent to:
                      <strong className="login-target-email"> {formData.email}</strong>
                    </p>
                    <button
                      type="button"
                      className="login-change-email-btn"
                      onClick={() => setResetStep(1)}
                    >
                      Change Email
                    </button>
                  </div>

                  <div className="login-field">
                    <label htmlFor="forgot-otp" className="login-label">
                      6-Digit Authorization Code
                    </label>
                    <input
                      id="forgot-otp"
                      type="text"
                      name="otp"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={7}
                      placeholder="• • • • • •"
                      value={formData.otp}
                      onChange={handleOtpChange}
                      className="login-input login-otp-input"
                      required
                      autoFocus
                      autoComplete="one-time-code"
                      disabled={submitting}
                    />
                  </div>

                  <div className="login-timer-row">
                    <span className="login-timer-text">
                      Code expires in:{' '}
                      <strong className={countdown < 60 ? 'timer-urgent' : ''}>
                        {formatTimer(countdown)}
                      </strong>
                    </span>
                    <button
                      type="button"
                      className="login-resend-btn"
                      onClick={handleResendResetOtp}
                      disabled={!canResend || submitting}
                    >
                      {canResend ? 'Resend Code' : `Resend in ${resendCooldown}s`}
                    </button>
                  </div>

                  <p className="login-spam-hint">
                    <strong>Can't find the email?</strong> Please check your <strong>Spam</strong>, <strong>Junk</strong>, or <strong>Promotions</strong> folder.
                  </p>

                  <div className="login-field">
                    <label htmlFor="forgot-new-password" className="login-label">
                      New Password
                    </label>
                    <input
                      id="forgot-new-password"
                      type="password"
                      name="newPassword"
                      placeholder="At least 6 characters"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="login-input"
                      required
                      autoComplete="new-password"
                      disabled={submitting}
                    />
                  </div>

                  <div className="login-field">
                    <label htmlFor="forgot-confirm-new-password" className="login-label">
                      Confirm New Password
                    </label>
                    <input
                      id="forgot-confirm-new-password"
                      type="password"
                      name="confirmNewPassword"
                      placeholder="Re-enter new password"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      className="login-input"
                      required
                      autoComplete="new-password"
                      disabled={submitting}
                    />
                  </div>

                  <button
                    type="submit"
                    className="login-submit-btn"
                    id="btn-update-password"
                    disabled={submitting}
                  >
                    {submitting ? <span className="login-spinner" /> : 'Update Password & Sign In'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer note */}
          <div className="login-card-footer">
            <div className="login-card-rule thin" />
            <div className="login-card-rule thick" />
            <p className="login-footer-info">
              Protected by AeroXplore Secure Authentication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
