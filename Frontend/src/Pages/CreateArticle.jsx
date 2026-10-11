import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthButton from '../components/AuthButton';
import { API_BASE } from '../utils/api';
import '../CSS/CreateArticle.css';

const CATEGORIES = [
  'Defence Aviation',
  'Commercial Aviation',
  'Space Exploration & Rocketry',
  'Aviation History & Archives',
  'Trailblazing Personalities & Aces',
  'Engineering Corner & Propulsion',
  'Aviation Security & Air Defence',
  'Military History & Legacies',
  'Unmanned Systems & Drones',
  'Aerodynamics & Aircraft Design',
  'Supersonic & Hypersonic Flight',
  'Air Combat Tactics & Strategy',
  'Avionics & Cockpit Technology',
  'Air Accident & Safety Investigations',
  'Naval Aviation & Carrier Wings',
  'Experimental & Black Projects',
  'General Aviation & Flight Training',
  'Future Flight & eVTOL',
  'Warbirds & Vintage Restorations',
  'Helicopters & Rotary Wing',
  'Aerospace Defense Missiles & Radar',
];

const THEMES = [
  { id: 'article-bg', label: 'Classic Parchment', bg: '/images/Article-bg.png', tint: '#2c1810', accent: '#8c6721' },
  { id: 'article-bg-blue', label: 'Aero Blue', bg: '/images/Article-bg-blue.png', tint: '#16324f', accent: '#2a6f97' },
  { id: 'article-bg-green', label: 'Olive Green', bg: '/images/Article-bg-green.png', tint: '#1e3820', accent: '#386641' },
  { id: 'article-bg-pink', label: 'Crimson Pink', bg: '/images/Article-bg-pink.png', tint: '#4a1525', accent: '#9b2226' },
];

export default function CreateArticle() {
  const { user, token, isAuthenticated, loading, acceptCreatorGuidelines } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const isSuperUser = user?.isSuperUser || user?.role === 'admin';
  // Author Code of Conduct & Publishing Caution appears every time user visits Create
  const [sessionAcceptedGuidelines, setSessionAcceptedGuidelines] = useState(false);
  const hasAcceptedGuidelines = isSuperUser || (editId ? true : false) || sessionAcceptedGuidelines;

  const [guidelinesAcceptedChecked, setGuidelinesAcceptedChecked] = useState(false);
  const [acceptingGuidelines, setAcceptingGuidelines] = useState(false);
  const [guidelinesError, setGuidelinesError] = useState('');

  // Category combobox state
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categoryHighlightIndex, setCategoryHighlightIndex] = useState(-1);
  const categoryWrapperRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    authorName: '',
    category: 'Defence Aviation',
    thought: '',
    theme: 'article-bg',
    image: '/images/Background.png',
    content: '',
    status: 'published',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(''); // 'draft' | 'published'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (categoryWrapperRef.current && !categoryWrapperRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes((formData.category || '').toLowerCase().trim())
  );

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, category: val }));
    setCategoryDropdownOpen(true);
    setCategoryHighlightIndex(-1);
    if (error) setError('');
  };

  const handleSelectCategory = (cat) => {
    setFormData((prev) => ({ ...prev, category: cat }));
    setCategoryDropdownOpen(false);
    setCategoryHighlightIndex(-1);
  };

  const handleCategoryKeyDown = (e) => {
    if (!categoryDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setCategoryDropdownOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCategoryHighlightIndex((prev) =>
        prev < filteredCategories.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCategoryHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCategories.length - 1
      );
    } else if (e.key === 'Enter') {
      if (categoryHighlightIndex >= 0 && filteredCategories[categoryHighlightIndex]) {
        e.preventDefault();
        handleSelectCategory(filteredCategories[categoryHighlightIndex]);
      } else {
        setCategoryDropdownOpen(false);
      }
    } else if (e.key === 'Escape') {
      setCategoryDropdownOpen(false);
    }
  };

  // Handle Author Guidelines Acceptance for non-admins
  const handleAcceptGuidelines = async (e) => {
    e.preventDefault();
    if (!guidelinesAcceptedChecked) return;

    setAcceptingGuidelines(true);
    setGuidelinesError('');
    try {
      if (acceptCreatorGuidelines) {
        await acceptCreatorGuidelines();
      }
      setSessionAcceptedGuidelines(true);
    } catch (err) {
      console.error('Failed to accept creator guidelines:', err);
      setGuidelinesError(err.message || 'Failed to record your acknowledgment. Please try again.');
    } finally {
      setAcceptingGuidelines(false);
    }
  };

  // Redirect if unauthenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/create' } } });
    }
  }, [loading, isAuthenticated, navigate]);

  // Set default author name from logged-in user
  useEffect(() => {
    if (user && !editId && !formData.authorName) {
      setFormData((prev) => ({
        ...prev,
        authorName: user.name || user.email.split('@')[0] || 'AeroXplore Aviator',
      }));
    }
  }, [user, editId, formData.authorName]);

  // Load article if in edit mode
  useEffect(() => {
    if (!editId) return;

    // Wait until auth state is finished verifying session so we have user & token
    if (loading) return;

    const authToken = token || localStorage.getItem('aeroxplore_auth_token');
    if (!authToken) {
      navigate('/login', { state: { from: { pathname: `/create?edit=${editId}` } } });
      return;
    }

    const fetchArticleForEdit = async () => {
      setLoadingEdit(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/articles/${editId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success && data.article) {
          const art = data.article;

          // Strict author permission check: users cannot edit other authors' articles
          const currentUserId = user ? String(user._id || user.id || '') : '';
          const currentUserEmail = user?.email ? user.email.toLowerCase().trim() : '';
          const articleAuthorId = art.author?._id ? String(art.author._id) : (art.author ? String(art.author) : '');
          const articleAuthorEmail = art.author?.email ? art.author.email.toLowerCase().trim() : '';
          const isSuper = Boolean(user?.isSuperUser || user?.role === 'admin');

          const isAuthor = Boolean(
            (currentUserId && articleAuthorId && currentUserId === articleAuthorId) ||
            (currentUserEmail && articleAuthorEmail && currentUserEmail === articleAuthorEmail)
          );

          if (!isAuthor && !isSuper) {
            setError('Access Denied: You do not have permission to edit another author’s dispatch.');
            return;
          }

          setFormData({
            title: art.title || '',
            authorName: art.authorName || '',
            category: art.category || 'Defence Aviation',
            thought: art.thought || '',
            theme: art.theme || 'article-bg',
            image: art.image || '/images/Background.png',
            content: Array.isArray(art.content) ? art.content.join('\n\n') : art.content || '',
            status: art.status || 'published',
          });
        } else {
          setError(data.message || 'Unable to load article for editing.');
        }
      } catch (err) {
        console.error('Fetch edit error:', err);
        setError('Failed to retrieve dispatch for editing.');
      } finally {
        setLoadingEdit(false);
      }
    };

    fetchArticleForEdit();
  }, [editId, token, loading, user, API_BASE, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSelectTheme = (themeId) => {
    setFormData((prev) => ({ ...prev, theme: themeId }));
  };

  // Cloudinary image file upload handler
  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    setUploadingImage(true);
    setUploadSuccess('');
    setError('');

    const uploadPayload = new FormData();
    uploadPayload.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadPayload,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Image upload failed. Please try again.');
      }

      setFormData((prev) => ({ ...prev, image: data.url }));
      setUploadSuccess('Image successfully uploaded!');
      setTimeout(() => setUploadSuccess(''), 4000);
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const onFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e, forcedStatus) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Please provide an article headline/title.');
      return;
    }

    if (!formData.content.trim()) {
      setError('Please write at least one paragraph of article content.');
      return;
    }

    const targetStatus = forcedStatus || formData.status || 'published';
    const payload = { ...formData, status: targetStatus };

    setSubmitting(true);
    setSubmittingAction(targetStatus);

    try {
      const authToken = token || localStorage.getItem('aeroxplore_auth_token');
      const url = editId ? `${API_BASE}/articles/${editId}` : `${API_BASE}/articles`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to ${editId ? 'update' : (targetStatus === 'draft' ? 'save draft' : 'publish')} article.`);
      }

      setSuccess(
        targetStatus === 'draft'
          ? (editId ? 'Draft updated successfully!' : 'Article saved to your drafts!')
          : (editId ? 'Dispatch updated and published successfully!' : 'Dispatch published successfully!')
      );
      setTimeout(() => {
        navigate('/my-articles');
      }, 1200);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Unable to save article. Please try again.');
    } finally {
      setSubmitting(false);
      setSubmittingAction('');
    }
  };

  if (loading || loadingEdit) {
    return (
      <div className="ca-root">
        <div className="ca-loading">
          {loadingEdit ? 'Loading Dispatch for Editing...' : 'Loading Editorial Desk...'}
        </div>
      </div>
    );
  }

  if (editId && error && error.includes('Access Denied')) {
    return (
      <div className="ca-root">
        <div className="ca-paper-texture" />
        <div className="ca-inner" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="ca-top-bar" style={{ justifyContent: 'flex-start', marginBottom: '2rem' }}>
            <Link to="/my-articles" className="ca-back-link">
              ← Return to My Articles
            </Link>
          </div>
          <div className="ca-warning-bullet-badge penalty" style={{ margin: '0 auto 1.5rem', width: '56px', height: '56px', fontSize: '1.4rem' }}>!</div>
          <h2 style={{ fontFamily: 'Cinzel Decorative, Georgia, serif', color: '#2c1810', marginBottom: '1rem' }}>Restricted Author Access</h2>
          <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1.2rem', color: '#3c281e', maxWidth: '600px', margin: '0 auto 2rem' }}>
            You do not have authorization to edit another author’s dispatch. You can only view or edit dispatches created by your own account.
          </p>
          <Link to="/my-articles" className="ca-submit-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Go to My Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ca-root">
      <div className="ca-paper-texture" />

      <div className="ca-inner">
        {/* Top bar */}
        <div className="ca-top-bar">
          <Link to="/" className="ca-back-link" id="ca-return-home">
            ← Return to AeroXplore
          </Link>
          <AuthButton />
        </div>

        {!hasAcceptedGuidelines ? (
          /* Warning & Caution Pre-Flight Screen for Non-Admin Creators */
          <div className="ca-warning-container" id="creator-warning-container">
            <div className="ca-warning-card">
              <div className="ca-warning-masthead">
                <div className="ca-rule thick" />
                <div className="ca-rule thin" />
                <div className="ca-warning-badge-wrap">
                  <span className="ca-warning-badge">MANDATORY AVIATOR NOTICE &amp; EDITORIAL STANDARDS</span>
                </div>
                <h1 className="ca-warning-title">Author Code of Conduct &amp; Publishing Caution</h1>
                <p className="ca-warning-subtitle">
                  Please read and acknowledge the following publishing mandates before dispatching chronicles to AeroXplore.
                </p>
                <div className="ca-rule thin" />
              </div>

              <div className="ca-warning-intro-box">
                <p>
                  AeroXplore is committed to authentic aviation journalism, historical preservation, and rigorous aerospace engineering analysis. Every author holds direct responsibility for the integrity, dignity, and accuracy of their publications.
                </p>
              </div>

              <div className="ca-warning-bullet-list">
                <div className="ca-warning-bullet-item">
                  <div className="ca-warning-bullet-badge">1</div>
                  <div className="ca-warning-bullet-content">
                    <h3>Zero Tolerance for Hate Speech</h3>
                    <p>
                      Avoid hate speech targeting any company, aerospace manufacturer, nation, military force, or community. Constructive criticism, engineering scrutiny, and historical debates are fully permitted and encouraged, but hatred, malice, slurs, and hate speech are strictly prohibited.
                    </p>
                  </div>
                </div>

                <div className="ca-warning-bullet-item">
                  <div className="ca-warning-bullet-badge">2</div>
                  <div className="ca-warning-bullet-content">
                    <h3>Mandatory Fact Verification</h3>
                    <p>
                      Rigorously verify all technical specifications, operational data, combat histories, and aircraft parameters you write before publishing. AeroXplore readers rely on authenticated chronicle data; unverified or fabricated claims are prohibited.
                    </p>
                  </div>
                </div>

                <div className="ca-warning-bullet-item">
                  <div className="ca-warning-bullet-badge">3</div>
                  <div className="ca-warning-bullet-content">
                    <h3>No Hazardous or Illegal Information</h3>
                    <p>
                      Do not promote, depict, or instruct in illegal activities, hazardous aviation practices, flight safety breaches, unauthorized sabotage, or the leak of classified military/defense intelligence.
                    </p>
                  </div>
                </div>

                <div className="ca-warning-bullet-item penalty">
                  <div className="ca-warning-bullet-badge penalty">4</div>
                  <div className="ca-warning-bullet-content">
                    <h3>Penalties: Immediate Article Deletion &amp; Account Suspension</h3>
                    <p>
                      If you are found violating any of these standards, it will result in the immediate deletion of your article and the permanent suspension of your account from AeroXplore.
                    </p>
                  </div>
                </div>
              </div>

              {guidelinesError && (
                <div className="ca-alert error" style={{ margin: '1.25rem 0' }}>
                  {guidelinesError}
                </div>
              )}

              <form className="ca-warning-form" onSubmit={handleAcceptGuidelines} noValidate>
                <div className="ca-warning-checkbox-row">
                  <label className="ca-warning-checkbox-label" htmlFor="ca-accept-checkbox">
                    <input
                      type="checkbox"
                      id="ca-accept-checkbox"
                      checked={guidelinesAcceptedChecked}
                      onChange={(e) => setGuidelinesAcceptedChecked(e.target.checked)}
                      className="ca-warning-checkbox"
                      disabled={acceptingGuidelines}
                    />
                    <span className="ca-warning-checkbox-text">
                      I have read, understood, and accept these editorial rules. I pledge to uphold factual accuracy, avoid hate speech, and adhere to AeroXplore publishing standards.
                    </span>
                  </label>
                </div>

                <div className="ca-warning-btn-row">
                  <Link to="/" className="ca-cancel-btn" id="ca-cancel-guidelines">
                    Cancel &amp; Return Home
                  </Link>
                  <button
                    type="submit"
                    className="ca-submit-btn"
                    id="btn-accept-guidelines"
                    disabled={!guidelinesAcceptedChecked || acceptingGuidelines}
                  >
                    {acceptingGuidelines ? 'Recording Agreement...' : 'Acknowledge & Enter Editorial Studio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Masthead */}
            <header className="ca-masthead">
          <div className="ca-rule thick" />
          <div className="ca-rule thin" />
          <h1 className="ca-title">{editId ? 'Revise Dispatch' : 'Editorial Dispatch'}</h1>
          <p className="ca-subtitle">
            {editId
              ? 'Update & Polish Your Aviation Chronicle'
              : 'Draft & Publish an AeroXplore Chronicle'}
          </p>
          <div className="ca-rule thin" />
          <div className="ca-info-row">
            <span>
              Editor:{' '}
              <strong>{formData.authorName || user?.name || user?.email}</strong>
            </span>
            <span>
              Date:{' '}
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="ca-rule thick" />
        </header>

        {/* Alerts */}
        {error && (
          <div className="ca-alert ca-alert-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="ca-alert ca-alert-success" role="status">
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* Writing Form */}
        <form className="ca-form" onSubmit={handleSubmit}>
          {/* 1. Article Title */}
          <div className="ca-field">
            <label htmlFor="ca-title-input" className="ca-label">
              Article Headline / Title *
            </label>
            <input
              id="ca-title-input"
              type="text"
              name="title"
              placeholder="e.g. The Stealth Revolution: Engineering Beyond the Radar Horizon"
              value={formData.title}
              onChange={handleChange}
              className="ca-input ca-input-title"
              required
              disabled={submitting}
            />
          </div>

          {/* 2. Author Name & Category Row */}
          <div className="ca-form-row">
            <div className="ca-field">
              <label htmlFor="ca-author-input" className="ca-label">
                Author's Name / Byline *
              </label>
              <input
                id="ca-author-input"
                type="text"
                name="authorName"
                placeholder="e.g. Flight Lt. Diwakar"
                value={formData.authorName}
                onChange={handleChange}
                className="ca-input"
                required
                disabled={submitting}
              />
            </div>

            <div className="ca-field" ref={categoryWrapperRef}>
              <label htmlFor="ca-category-input" className="ca-label">
                Editorial Dispatch Category *
              </label>
              <div className="ca-combobox-wrap">
                <input
                  id="ca-category-input"
                  type="text"
                  name="category"
                  placeholder="Type or pick category (e.g. Supersonic Flight)"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  onFocus={() => setCategoryDropdownOpen(true)}
                  onKeyDown={handleCategoryKeyDown}
                  className="ca-input ca-combobox-input"
                  autoComplete="off"
                  required
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="ca-combobox-toggle-btn"
                  onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                  tabIndex={-1}
                  aria-label="Toggle category list"
                  disabled={submitting}
                >
                  ▾
                </button>

                {categoryDropdownOpen && (
                  <div className="ca-combobox-menu" role="listbox">
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat, idx) => {
                        const isSelected = formData.category.trim().toLowerCase() === cat.toLowerCase();
                        const isHighlighted = idx === categoryHighlightIndex;
                        return (
                          <div
                            key={cat}
                            role="option"
                            aria-selected={isSelected}
                            className={`ca-combobox-item ${isHighlighted ? 'highlighted' : ''} ${
                              isSelected ? 'selected' : ''
                            }`}
                            onMouseDown={() => handleSelectCategory(cat)}
                          >
                            <span className="ca-combobox-item-text">{cat}</span>
                            {isSelected && <span className="ca-combobox-check">✓</span>}
                          </div>
                        );
                      })
                    ) : (
                      <div className="ca-combobox-custom-notice">
                        <span>Custom Category: <strong>"{formData.category}"</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className="ca-field-hint">
                Type to search suggestions or enter any custom category of your choice.
              </span>
            </div>
          </div>

          {/* 3. Parchment Theme Selector */}
          <div className="ca-field">
            <label className="ca-label">
              Parchment Background Theme *
            </label>
            <p className="ca-hint">Choose the newspaper stationery style for this dispatch:</p>
            <div className="ca-theme-grid">
              {THEMES.map((t) => {
                const isSelected = formData.theme === t.id;
                return (
                  <button
                    type="button"
                    key={t.id}
                    className={`ca-theme-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectTheme(t.id)}
                    style={{ borderColor: isSelected ? t.accent : undefined }}
                    disabled={submitting}
                  >
                    <div
                      className="ca-theme-swatch"
                      style={{
                        backgroundImage: `url('${t.bg}')`,
                        borderColor: isSelected ? t.accent : 'rgba(44, 24, 16, 0.3)',
                      }}
                    >
                      {isSelected && <span className="ca-theme-check">✓</span>}
                    </div>
                    <span className="ca-theme-title">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Epigraph / Guiding Thought */}
          <div className="ca-field">
            <label htmlFor="ca-thought-input" className="ca-label">
              Guiding Thought / Epigraph (Displayed in Quotes)
            </label>
            <input
              id="ca-thought-input"
              type="text"
              name="thought"
              placeholder="e.g. 'He who commands the sky commands the battlefield.'"
              value={formData.thought}
              onChange={handleChange}
              className="ca-input"
              disabled={submitting}
            />
          </div>

          {/* 5. Image Upload */}
          <div className="ca-field">
            <label className="ca-label">Feature Imagery</label>

            {/* Dropzone / File Picker */}
            <div
              className={`ca-dropzone ${uploadingImage ? 'uploading' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileInputChange}
                accept="image/*"
                style={{ display: 'none' }}
                disabled={submitting || uploadingImage}
              />
              <div className="ca-dropzone-content">
                {uploadingImage ? (
                  <div className="ca-dropzone-status">
                    Uploading image securely...
                  </div>
                ) : (
                  <div className="ca-dropzone-text">
                    <strong>Click to upload an image from your device</strong> or drag and drop here
                    <p className="ca-dropzone-sub">PNG, JPG, WebP up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {uploadSuccess && (
              <div className="ca-upload-success">
                <span>✓</span> {uploadSuccess}
              </div>
            )}

            {formData.image && formData.image !== '/images/Background.png' && (
              <div className="ca-attached-image-bar">
                <span className="ca-attached-text">Custom Feature Image Attached</span>
                <button
                  type="button"
                  className="ca-attached-remove-btn"
                  onClick={() => setFormData((prev) => ({ ...prev, image: '/images/Background.png' }))}
                  title="Remove custom image"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* 6. Article Content */}
          <div className="ca-field">
            <label htmlFor="ca-content-textarea" className="ca-label">
              Chronicle Text / Body Content *
            </label>

            {/* Writing Instructions for Paragraph Spacing */}
            <div className="ca-paragraph-guide" id="ca-paragraph-guide">
              <div className="ca-guide-header">
                <span className="ca-guide-title">Paragraph Spacing &amp; Writing Instructions</span>
              </div>
              <div className="ca-guide-body">
                <div className="ca-guide-item">
                  <span className="ca-guide-bullet">✦</span>
                  <p>
                    <strong>Paragraph Spacing (Double Enter):</strong> Press <kbd className="ca-kbd">Enter</kbd> <strong>twice</strong> (leaving one empty blank line) between paragraphs. Each distinct paragraph will automatically be formatted into an authentic newspaper column layout with proper margins.
                  </p>
                </div>
                <div className="ca-guide-item">
                  <span className="ca-guide-bullet">✦</span>
                  <p>
                    <strong>Section Structure:</strong> Avoid single continuous blocks of text. Divide your dispatch into crisp 3–5 sentence paragraphs for an engaging editorial reading experience.
                  </p>
                </div>
                <div className="ca-guide-item">
                  <span className="ca-guide-bullet">✦</span>
                  <p>
                    <strong>Quotes &amp; Epigraphs:</strong> Place notable aviation quotes or pilot testimonials on their own isolated lines to let them stand out in the final dispatch.
                  </p>
                </div>
              </div>
            </div>

            <textarea
              id="ca-content-textarea"
              name="content"
              rows="14"
              placeholder=""
              value={formData.content}
              onChange={handleChange}
              className="ca-textarea"
              required
              disabled={submitting}
            />
          </div>

          {/* Action Row: Cancel, Save as Draft, Publish */}
          <div className="ca-btn-row">
            <Link to="/my-articles" className="ca-cancel-btn" id="ca-cancel-btn">
              Cancel
            </Link>
            <button
              type="button"
              className={`ca-draft-btn ${submitting && submittingAction === 'draft' ? 'loading' : ''}`}
              id="ca-draft-btn"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={submitting || uploadingImage}
            >
              {submitting && submittingAction === 'draft'
                ? 'Saving Draft...'
                : editId && formData.status === 'draft'
                ? 'Update Draft'
                : 'Save as Draft'}
            </button>
            <button
              type="button"
              className={`ca-submit-btn ${submitting && submittingAction === 'published' ? 'loading' : ''}`}
              id="ca-publish-btn"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={submitting || uploadingImage}
            >
              {submitting && submittingAction === 'published'
                ? editId
                  ? 'Saving Changes...'
                  : 'Publishing...'
                : editId
                ? formData.status === 'draft'
                  ? 'Publish Dispatch →'
                  : 'Save Changes →'
                : 'Publish Dispatch →'}
            </button>
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
}
