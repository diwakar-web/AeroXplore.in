import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/AllBlogs.css';
import useScrollReveal from '../hooks/useScrollReveal';

// ─── Blog Data (single source of truth — keep in sync with Home.jsx) ──────────
const allBlogPosts = [
  {
    id: 'tejas_1',
    title: " Tejas: Pride, Payloads, and Production Bottlenecks",
    date: 'April 14, 2026',
    author: 'Diwakar Nagar',
    image: '/images/tejas.jpg',
    category: 'Defence Aviation',
  },
  {
    id: '5th gen',
    title: "The Fifth-Generation Dilemma: Su-57 Felon vs. F-35 Lightning II",
    date: 'April 13, 2026',
    author: 'Diwakar Nagar',
    image: '/images/su57-f35.jpg',
    category: 'Defence Aviation',
  },
  {
    id: 'drone',
    title: "The Drone Revolution: Precision, Attrition, and India's Path to Sovereignty",
    date: 'April 13, 2026',
    author: 'Diwakar Nagar',
    image: '/images/drone.jpg',
    category: 'Unmanned Systems',
  },
  {
    id: 'engine',
    title: "The Heart of the Machine: How a Fighter Jet Engine Generates Supersonic Thrust",
    date: 'April 13, 2026',
    author: 'Diwakar Nagar',
    image: '/images/engine.png',
    category: 'Engineering Corner',
  },
  
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AllBlogs() {
  useScrollReveal();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allBlogPosts;
    return allBlogPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.date.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="ab-root">
      <div className="ab-paper-texture" />

      <div className="ab-inner">

        {/* ── Back Link ── */}
        <Link to="/" className="ab-back-link" id="ab-back-home" data-reveal="fade-in">
          ← Return to AeroXplore
        </Link>

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
            {filtered.length === allBlogPosts.length
              ? `${allBlogPosts.length} dispatches`
              : `${filtered.length} of ${allBlogPosts.length} dispatches`}
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
                to={`/blog/${post.id}`}
                key={post.id}
                className="ab-card"
                id={`ab-card-${post.id}`}
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
            <p className="ab-no-results-icon">✈</p>
            <p className="ab-no-results-msg">No dispatches found for <em>"{query}"</em></p>
            <button className="ab-no-results-clear" onClick={() => setQuery('')} id="ab-no-results-clear-btn">
              Clear Search
            </button>
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
  );
}
