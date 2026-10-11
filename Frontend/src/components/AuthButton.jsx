import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../CSS/AuthButton.css';

export default function AuthButton() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCreateClick = () => {
    navigate('/create');
  };

  const handleMyArticlesClick = () => {
    setDropdownOpen(false);
    navigate('/my-articles');
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  // ── Logged Out State ────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="auth-btn-group">
        <button
          onClick={handleLoginClick}
          className="auth-btn-signin"
          id="header-login-btn"
          aria-label="Sign in to AeroXplore"
          title="Sign in or Register"
        >
          <span className="auth-btn-ornament">✦</span>
          <span className="auth-btn-text">SIGN IN</span>
        </button>
      </div>
    );
  }

  // ── Logged In State (Create & Account buttons) ──────────────────────────────
  const displayName = user.name || user.email.split('@')[0] || 'Aviator';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="auth-btn-group">
      {/* 1. Create Button */}
      <button
        type="button"
        onClick={handleCreateClick}
        className="auth-header-btn auth-btn-create"
        id="header-create-btn"
        title="Write an article"
      >
        <svg
          className="auth-btn-icon"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
        <span className="auth-btn-label">Create</span>
      </button>

      {/* 2. Account Button with Dropdown */}
      <div className="auth-dropdown-wrapper" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className={`auth-header-btn auth-btn-account ${dropdownOpen ? 'active' : ''}`}
          id="header-account-btn"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          title={`Account: ${displayName}`}
        >
          <div className="auth-avatar-wrap">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="auth-avatar-img"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="auth-avatar-initials">{initials}</span>
            )}
          </div>
          <span className="auth-btn-label">Account</span>
          <svg
            className={`auth-chevron-svg ${dropdownOpen ? 'open' : ''}`}
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {dropdownOpen && (
          <div className="auth-dropdown-menu" role="menu">
            <div className="auth-dropdown-header">
              <p className="auth-dropdown-name">{user.name || displayName}</p>
              <p className="auth-dropdown-email">{user.email}</p>
            </div>

            <div className="auth-dropdown-divider" />

            <div className="auth-dropdown-actions">
              {/* Option 1: My Articles */}
              <button
                type="button"
                onClick={handleMyArticlesClick}
                className="auth-dropdown-item"
                role="menuitem"
                id="account-my-articles-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>My Articles</span>
              </button>

              {/* Option 2: Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="auth-dropdown-item auth-dropdown-logout-item"
                role="menuitem"
                id="account-logout-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
