import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthButton from '../components/AuthButton';
import { API_BASE } from '../utils/api';
import '../CSS/MyArticles.css';

const THEME_NAMES = {
  'article-bg': 'Classic Parchment',
  'article-bg-blue': 'Aero Blue',
  'article-bg-green': 'Olive Green',
  'article-bg-pink': 'Crimson Pink',
};

export default function MyArticles() {
  const { user, token, isAuthenticated, loading } = useAuth();
  const [articles, setArticles] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [adminViewMode, setAdminViewMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/my-articles' } } });
    }
  }, [loading, isAuthenticated, navigate]);

  const fetchArticles = async (showAll = false) => {
    if (!token) return;
    setFetching(true);
    setError('');
    try {
      const endpoint = showAll ? `${API_BASE}/articles/my?all=true` : `${API_BASE}/articles/my`;
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setArticles(data.articles || []);
        if (data.isSuperUser !== undefined) {
          setIsSuperUser(data.isSuperUser);
        }
      } else {
        setError(data.message || 'Failed to load dispatches.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to retrieve articles. Please check server connection.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchArticles(adminViewMode);
  }, [token, adminViewMode]);

  const handleDelete = async (id, title) => {
    const promptMsg = adminViewMode
      ? `[DEVELOPER SUPERPOWER]\nAre you sure you want to permanently delete: "${title || 'this article'}"?`
      : `Are you sure you want to delete this dispatch: "${title || 'Untitled'}"?`;

    if (!window.confirm(promptMsg)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setArticles((prev) => prev.filter((a) => a._id !== id));
      } else {
        alert(data.message || 'Failed to delete article.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Unable to delete article. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/create?edit=${id}`);
  };

  if (loading) {
    return (
      <div className="ma-root">
        <div className="ma-loading">Loading Your Flight Log...</div>
      </div>
    );
  }

  return (
    <div className="ma-root">
      <div className="ma-paper-texture" />

      <div className="ma-inner">
        {/* Top Bar */}
        <div className="ma-top-bar">
          <Link to="/" className="ma-back-link" id="ma-return-home">
            ← Return to AeroXplore
          </Link>
          <AuthButton />
        </div>

        {/* Masthead */}
        <header className="ma-masthead">
          <div className="ma-rule thick" />
          <div className="ma-rule thin" />
          <h1 className="ma-title">
            {adminViewMode ? 'Platform Archives' : 'My Dispatches'}
          </h1>
          <p className="ma-subtitle">
            {adminViewMode
              ? 'Developer Control Desk · All Community Dispatches'
              : 'Personal Aviation Archive & Flight Records'}
          </p>
          <div className="ma-rule thin" />
          <div className="ma-info-row">
            <span>
              Aviator: <strong>{user?.name || user?.email}</strong>
              {isSuperUser && <span className="ma-super-tag">Developer Mode</span>}
            </span>
            <span>
              Total Records: <strong>{articles.length}</strong>
            </span>
          </div>
          <div className="ma-rule thick" />
        </header>

        {/* Error notice */}
        {error && (
          <div className="ma-alert ma-alert-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        {/* Developer Superpower Tabs */}
        {isSuperUser && (
          <div className="ma-admin-tabs">
            <button
              type="button"
              className={`ma-tab-btn ${!adminViewMode ? 'active' : ''}`}
              onClick={() => setAdminViewMode(false)}
            >
              My Personal Dispatches
            </button>
            <button
              type="button"
              className={`ma-tab-btn superpower ${adminViewMode ? 'active' : ''}`}
              onClick={() => setAdminViewMode(true)}
              title="Superpower to view, edit, or delete any user's article"
            >
            All Community Dispatches (Developer Mode)
            </button>
          </div>
        )}

        {/* Header Action Row */}
        <div className="ma-action-row">
          <h2 className="ma-section-title">
            {adminViewMode ? 'All Dispatches Across AeroXplore' : 'Authored Flight Logs'}
          </h2>
          <Link to="/create" className="ma-create-btn" id="ma-create-new-btn">
          Write New Dispatch
          </Link>
        </div>

        {/* Articles List */}
        {fetching ? (
          <div className="ma-loading">Retrieving archives from hangar...</div>
        ) : articles.length === 0 ? (
          <div className="ma-empty-state">
            <div className="ma-empty-ornament">✦</div>
            <h3 className="ma-empty-title">
              {adminViewMode ? 'No Community Dispatches Found' : 'No Dispatches Filed Yet'}
            </h3>
            <p className="ma-empty-desc">
              {adminViewMode
                ? 'No users have filed database articles yet.'
                : 'Your flight journal is empty. Share your expertise on aviation history, supersonic engineering, or military aeronautics.'}
            </p>
            <Link to="/create" className="ma-empty-btn">
              Write Your First Dispatch →
            </Link>
          </div>
        ) : (
          <div className="ma-grid">
            {articles.map((art) => (
              <article key={art._id} className={`blog-card ma-home-card theme-${art.theme || 'article-bg'}`}>
                <Link to={`/blog/${art.slug || art._id}`} className="blog-card-img-wrap">
                  <img
                    src={art.image || '/images/Background.png'}
                    alt={art.title}
                    className="blog-card-img"
                    onError={(e) => {
                      e.target.src = '/images/Background.png';
                    }}
                  />
                  <span className="blog-card-category">{art.category}</span>
                </Link>

                <div className="blog-card-body">
                  <h3 className="blog-card-title">
                    <Link to={`/blog/${art.slug || art._id}`} className="ma-card-title-link">
                      {art.title}
                    </Link>
                  </h3>

                  <div className="blog-card-meta">
                    <span className="blog-card-date">
                      {new Date(art.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="blog-card-sep">·</span>
                    <span className="blog-card-author">
                      By {art.authorName || 'Diwakar Nagar'}
                      {adminViewMode && art.author?.email && (
                        <span className="ma-author-email"> ({art.author.email})</span>
                      )}
                    </span>
                  </div>

                  {/* Options row: Only author can edit or delete their own article */}
                  <div className="ma-card-bottom-row">
                    <span
                      className={`ma-pill ma-pill-status ${
                        art.status === 'draft' ? 'draft' : 'published'
                      }`}
                    >
                      {art.status === 'draft' ? 'Draft' : 'Published'}
                    </span>

                    <Link
                      to={`/blog/${art.slug || art._id}`}
                      className="ma-pill ma-pill-read"
                      title="Read dispatch"
                    >
                      Read
                    </Link>

                    {(() => {
                      const currentUserId = user ? String(user._id || user.id || '') : '';
                      const currentUserEmail = user?.email ? user.email.toLowerCase().trim() : '';
                      const cardAuthorId = art.author?._id ? String(art.author._id) : (art.author ? String(art.author) : '');
                      const cardAuthorEmail = art.author?.email ? art.author.email.toLowerCase().trim() : '';
                      const isCardAuthor = Boolean(
                        (currentUserId && cardAuthorId && currentUserId === cardAuthorId) ||
                        (currentUserEmail && cardAuthorEmail && currentUserEmail === cardAuthorEmail)
                      );

                      if (!isCardAuthor && !isSuperUser) return null;

                      return (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEdit(art._id)}
                            className="ma-pill ma-pill-edit"
                            title="Edit this dispatch"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(art._id, art.title)}
                            className="ma-pill ma-pill-delete"
                            disabled={deletingId === art._id}
                            title="Delete this dispatch"
                          >
                            {deletingId === art._id ? '...' : 'Delete'}
                          </button>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
