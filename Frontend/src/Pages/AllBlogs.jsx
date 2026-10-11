import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/AllBlogs.css';
import '../CSS/LoadingOverlay.css';
import useScrollReveal from '../hooks/useScrollReveal';
import AuthButton from '../components/AuthButton';
import LoadingOverlay from '../components/LoadingOverlay';
import { API_BASE } from '../utils/api';

export default function AllBlogs() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();

    // Safety timeout: Never load for more than 2 seconds
    const maxSafetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 2000);

    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/articles`);
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.articles)) {
          const formatted = data.articles.map((art) => ({
            _id: art._id,
            id: art.slug || art._id,
            slug: art.slug,
            title: art.title,
            date: new Date(art.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            author: art.authorName || art.author?.name || 'AeroXplore Aviator',
            image: art.image || '/images/Background.png',
            category: art.category || 'Defence Aviation',
            theme: art.theme || 'article-bg',
          }));
          if (isMounted) setArticles(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch DB articles:', err);
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, Math.min(2000 - elapsed, 400));
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, remaining);
      }
    };

    fetchArticles();
    return () => {
      isMounted = false;
      clearTimeout(maxSafetyTimer);
    };
  }, []);

  useScrollReveal([query, articles, loading]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.date.toLowerCase().includes(q)
    );
  }, [query, articles]);

  return (
    <>
      <LoadingOverlay isVisible={loading} />

      <div className={`ab-root ${loading ? 'aero-page-blurred' : 'aero-page-sharp'}`}>
        <div className="ab-paper-texture" />

        <div className="ab-inner">

          {/* ── Top Bar ── */}
          <div className="ab-top-bar" data-reveal="fade-in">
            <Link to="/" className="ab-back-link" id="ab-back-home">
              ← Return to AeroXplore
            </Link>
            <AuthButton />
          </div>

          {/* ── Masthead ── */}
          <div className="ab-masthead" data-reveal="fade-in" style={{ '--reveal-delay': '0.05s' }}>
            <div className="ab-rule thick" />
            <div className="ab-rule thin" />
            <h1 className="ab-masthead-title">The Archive</h1>
            <p className="ab-masthead-sub">All Dispatches from AeroXplore</p>
            <div className="ab-rule thin" />
            <div className="ab-rule thick" />
          </div>

          {/* ── Search Box ── */}
          <div className="ab-search-wrap" data-reveal="fade-up" style={{ '--reveal-delay': '0.1s' }}>
            <div className="ab-search-box">
              <span className="ab-search-icon" aria-hidden="true">⌕</span>
              <input
                id="ab-search-input"
                type="text"
                className="ab-search-input"
                placeholder="Search by title, category, author…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button
                  className="ab-search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  id="ab-search-clear-btn"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="ab-result-count">
              {filtered.length === articles.length
                ? `${articles.length} dispatches`
                : `${filtered.length} of ${articles.length} dispatches`}
            </p>
          </div>

          {/* ── Section Divider ── */}
          <div className="ab-section-label-row" data-reveal="fade-in" style={{ '--reveal-delay': '0.15s' }}>
            <div className="ab-section-line" />
            <span className="ab-section-text">
              {query ? `Results for "${query}"` : 'All Dispatches'}
            </span>
            <div className="ab-section-line" />
          </div>

          {/* ── Cards Grid ── */}
          {filtered.length > 0 ? (
            <div className="ab-cards-grid">
              {filtered.map((post, i) => (
                <Link
                  to={`/blog/${post.slug || post.id}`}
                  key={post._id}
                  className={`ab-card theme-${post.theme || 'article-bg'}`}
                  id={`ab-card-${post.slug || post.id}`}
                  data-reveal="fade-up"
                  style={{ '--reveal-delay': `${i * 0.08}s` }}
                >
                  <div className="ab-card-img-wrap">
                    <img src={post.image} alt={post.title} className="ab-card-img" />
                    <span className="ab-card-category">{post.category}</span>
                  </div>
                  <div className="ab-card-body">
                    <h3 className="ab-card-title">{post.title}</h3>
                    <div className="ab-card-meta">
                      <span className="ab-card-date">{post.date}</span>
                      <span className="ab-card-sep">·</span>
                      <span className="ab-card-author">{post.author}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="ab-no-results">
              <p className="ab-no-results-icon">✦</p>
              <p className="ab-no-results-msg">
                {loading ? 'Retrieving dispatches from archive...' : `No dispatches found for "${query}"`}
              </p>
              {query && (
                <button className="ab-no-results-clear" onClick={() => setQuery('')} id="ab-no-results-clear-btn">
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* ── Footer Rule ── */}
          <div className="ab-footer-row">
            <div className="ab-rule thin" />
            <div className="ab-rule thick" />
            <p className="ab-footer-copy">© 2026 AeroXplore · Diwakar Nagar</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.75rem', color: '#888', background: '#0a0a0a' }}>
          I'm here to help spark ideas and provide a great starting point, but for anything mission-critical, it’s always a good move to double-check with official documentation or expert sources just to be safe!
        </div>
      </div>
    </>
  );
}
