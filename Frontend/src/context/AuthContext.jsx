import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const AuthContext = createContext(null);

import { API_BASE } from '../utils/api';
const TOKEN_KEY = 'aeroxplore_auth_token';
const USER_KEY = 'aeroxplore_auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [loading, setLoading] = useState(true);

  // Re-verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          } else {
            handleCleanLogout();
          }
        } else {
          handleCleanLogout();
        }
      } catch (err) {
        console.warn('Session verification deferred:', err);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const handleCleanLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Google Sign-In: Firebase popup + sync with MongoDB Database
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fbUser.email,
          name: fbUser.displayName || fbUser.email.split('@')[0],
          photoURL: fbUser.photoURL || '',
          uid: fbUser.uid,
          idToken,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to authenticate with database.');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Email/Password Login (JWT)
  const loginWithEmail = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to log in. Please verify your credentials.');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      console.error('JWT Login Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Email/Password Register (JWT)
  const registerWithEmail = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create account.');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      console.error('JWT Register Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Send Registration OTP
  const sendRegisterOtp = useCallback(async (email) => {
    const res = await fetch(`${API_BASE}/auth/send-register-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to dispatch verification code.');
    }
    return data;
  }, []);

  // Verify OTP
  const verifyOtp = useCallback(async (email, otp, purpose = 'register') => {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, purpose }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Invalid or expired verification code.');
    }
    return data;
  }, []);

  // Complete Registration with OTP verification token
  const completeRegistration = useCallback(async (name, email, password, verificationToken) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/complete-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, verificationToken }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to complete registration.');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } finally {
      setLoading(false);
    }
  }, []);

  // Send Password Reset OTP
  const sendResetOtp = useCallback(async (email) => {
    const res = await fetch(`${API_BASE}/auth/send-reset-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to dispatch reset code.');
    }
    return data;
  }, []);

  // Reset Password with OTP
  const resetPassword = useCallback(async (email, otp, newPassword) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update password.');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return { success: true, user: data.user };
    } finally {
      setLoading(false);
    }
  }, []);

  // Accept Creator Warning & Caution Guidelines
  const acceptCreatorGuidelines = useCallback(async () => {
    const storedToken = token || localStorage.getItem(TOKEN_KEY);
    if (!storedToken) throw new Error('You must be signed in to accept guidelines.');

    const res = await fetch(`${API_BASE}/auth/accept-creator-guidelines`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${storedToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to record guideline acceptance.');
    }

    setUser(data.user);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  }, [token]);

  // Sign out
  const logout = useCallback(async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Firebase signout warning:', err);
    }
    handleCleanLogout();
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    sendRegisterOtp,
    verifyOtp,
    completeRegistration,
    sendResetOtp,
    resetPassword,
    acceptCreatorGuidelines,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
