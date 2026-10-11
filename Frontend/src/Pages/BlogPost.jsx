import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../CSS/BlogPost.css';
import useScrollReveal from '../hooks/useScrollReveal';
import AuthButton from '../components/AuthButton';
import { useAuth } from '../context/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import '../CSS/LoadingOverlay.css';
import { API_BASE } from '../utils/api';

const THEME_BACKGROUNDS = {
  'article-bg': '/images/Article-bg.png',
  'article-bg-blue': '/images/Article-bg-blue.png',
  'article-bg-green': '/images/Article-bg-green.png',
  'article-bg-pink': '/images/Article-bg-pink.png',
};

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useScrollReveal([post, loading]);

  const [stats, setStats] = useState({ likes: 0, dislikes: 0 });
  const [voted, setVoted] = useState(false);
  const [userChoice, setUserChoice] = useState(null);

  // Fetch article purely from MongoDB
  useEffect(() => {
    if (!id) return;

    // Safety timeout: Never load for more than 2 seconds
    const maxSafetyTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    const fetchArticle = async () => {
      setLoading(true);
      setError('');
      try {
        const authToken = token || localStorage.getItem('aeroxplore_auth_token') || localStorage.getItem('aeroxplore_token');
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
        const res = await fetch(`${API_BASE}/articles/${encodeURIComponent(id)}`, { headers });
        const data = await res.json();
        if (res.ok && data.success && data.article) {
          const art = data.article;
          setPost({
            _id: art._id,
            authorId: art.author?._id ? String(art.author._id) : (art.author ? String(art.author) : ''),
            authorEmail: art.author?.email || '',
            title: art.title,
            slug: art.slug,
            status: art.status,
            date: new Date(art.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            author: art.authorName || art.author?.name || 'AeroXplore Aviator',
            image: art.image || '/images/Background.png',
            category: art.category || 'Defence Aviation',
            thought: art.thought || '',
            content: Array.isArray(art.content) ? art.content : [art.content],
            theme: art.theme || 'article-bg',
          });
        } else if (res.status === 403) {
          setError(data.message || 'This dispatch is an unpublished draft. Only its author and administrators can access it.');
        } else {
          setError('The dispatch you’re looking for doesn’t exist.');
        }
      } catch (err) {
        console.error('Failed to load article:', err);
        setError('Failed to load dispatch. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    return () => {
      clearTimeout(maxSafetyTimer);
    };
  }, [id, token]);

  // Blog reactions
  useEffect(() => {
    if (!id) return;
    setVoted(false);
    setUserChoice(null);

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/blog-stats/${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.success) {
          setStats({ likes: data.likes, dislikes: data.dislikes });
        }
      } catch (err) {
        console.error('Failed to fetch blog stats:', err);
      }
    };
    fetchStats();
  }, [id]);

  const handleVote = async (choice) => {
    if (voted) return;
    setVoted(true);
    setUserChoice(choice);

    setStats((prev) => ({
      ...prev,
      [choice === 'like' ? 'likes' : 'dislikes']: prev[choice === 'like' ? 'likes' : 'dislikes'] + 1,
    }));

    try {
      const res = await fetch(`${API_BASE}/blog-stats/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: id, action: choice }),
      });
      const data = await res.json();
      if (data.success) {
        setStats({ likes: data.likes, dislikes: data.dislikes });
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  // Author check: Strictly ensure only the author can see author actions and edit/delete their own article
  const currentUserId = user ? String(user._id || user.id || '') : '';
  const currentUserEmail = user?.email ? user.email.toLowerCase().trim() : '';
  const articleAuthorId = post?.authorId ? String(post.authorId) : '';
  const articleAuthorEmail = post?.authorEmail ? post.authorEmail.toLowerCase().trim() : '';

  const isSuper = Boolean(user?.isSuperUser || user?.role === 'admin');

  const isAuthor = Boolean(
    user &&
    post &&
    (
      isSuper ||
      (currentUserId && articleAuthorId && currentUserId === articleAuthorId) ||
      (currentUserEmail && articleAuthorEmail && currentUserEmail === articleAuthorEmail)
    )
  );

  const handleDeleteDispatch = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete: "${post.title}"?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/articles/${post._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        navigate('/my-articles');
      } else {
        alert(data.message || 'Failed to delete dispatch.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Unable to delete dispatch.');
    } finally {
      setDeleting(false);
    }
  };

  if (!loading && (error || !post)) {
    return (
      <div className="bp-root">
        <div className="bp-not-found">
          <h2>Restricted Dispatch Archive</h2>
          <p>{error || "The dispatch you're looking for doesn't exist."}</p>
          <Link to="/" className="bp-back-link">
            ← Return to AeroXplore
          </Link>
        </div>
      </div>
    );
  }

  const themeBg = (post && THEME_BACKGROUNDS[post.theme]) || '/images/Article-bg.png';

  return (
    <>
      <LoadingOverlay isVisible={loading} />

      <div className="bp-root">
        <main className="bp-main" style={{ backgroundImage: `url(${themeBg})`, minHeight: '100vh' }}>
          <div className="bp-inner">
            <div className="bp-top-bar">
              <Link to="/" className="bp-top-back-link">
                ← Return to Home Page
              </Link>
              <AuthButton />
            </div>

            {post && isAuthor && (
              <div className="bp-admin-bar" data-reveal="fade-in">
                <span className="bp-admin-badge">
                  Author Actions{post.status === 'draft' ? ' · Unpublished Draft' : ''}
                </span>
                <div className="bp-admin-actions">
                  <Link to={`/create?edit=${post._id}`} className="bp-admin-btn bp-admin-edit">
                    Edit Dispatch
                  </Link>
                  <button
                    type="button"
                    onClick={handleDeleteDispatch}
                    className="bp-admin-btn bp-admin-delete"
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete Dispatch'}
                  </button>
                </div>
              </div>
            )}

            {post ? (
              <div className={`bp-paper theme-${post.theme || 'article-bg'}`}>
                <div className="bp-paper-rule thick"></div>
                <div className="bp-paper-rule thin"></div>

                <div className="bp-meta-top">
                  <span className="bp-category">{post.category}</span>
              <span className="bp-date">{post.date}</span>
            </div>

            <h1 className="bp-title">{post.title}</h1>

            <div className="bp-byline">
              <span>By <strong>{post.author}</strong></span>
              <span className="bp-byline-sep">·</span>
              <span className="bp-read-time">{post.content.length * 2} min read</span>
            </div>

            <div className="bp-paper-rule thin"></div>

            <div className="bp-hero-img-wrap">
              <img src={post.image} alt={post.title} className="bp-hero-img" />
            </div>

            <div className="bp-paper-rule thin"></div>

            <div className="bp-content">
              {post.content.map((para, i) => (
                <p key={i} className="bp-para">{para}</p>
              ))}
            </div>

            {post.thought && (
              <p className="bp-closing-thought">
                {post.thought}
              </p>
            )}

            <div className="bp-vote-container" data-reveal="fade-up" style={{ '--reveal-delay': `${(post.content.length + 1) * 0.1}s` }}>
              <h3 className="bp-vote-title">Your scroll brought you here… worth it?</h3>
              <div className="bp-vote-buttons">
                <button
                  type="button"
                  className={`bp-vote-btn ${userChoice === 'like' ? 'voted-active' : ''} ${voted && userChoice !== 'like' ? 'disabled' : ''}`}
                  onClick={() => handleVote('like')}
                  disabled={voted}
                  aria-label="Thumbs Up"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={userChoice === 'like' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bp-vote-icon">
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`bp-vote-btn ${userChoice === 'dislike' ? 'voted-active' : ''} ${voted && userChoice !== 'dislike' ? 'disabled' : ''}`}
                  onClick={() => handleVote('dislike')}
                  disabled={voted}
                  aria-label="Thumbs Down"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={userChoice === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bp-vote-icon">
                    <path d="M17 14V2" />
                    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bp-paper-rule thin"></div>
            <div className="bp-paper-rule thick"></div>

            <div className="bp-footer-row">
              <Link to="/" className="bp-back-link" id="bp-return-home">← Return to AeroXplore</Link>
              <span className="bp-author-sig">— {post.author}</span>
            </div>
          </div>
        ) : (
          /* Blurred skeleton while dispatch is retrieved from MongoDB */
          <div className="bp-paper theme-article-bg bp-skeleton-paper" aria-hidden="true">
            <div className="bp-paper-rule thick" />
            <div className="bp-paper-rule thin" />

            <div className="bp-meta-top">
              <span className="bp-category">Aviation Intelligence</span>
              <span className="bp-date">Loading Dispatch...</span>
            </div>

            <div className="bp-skeleton-title-box">
              <div className="bp-skeleton-bar title-1" />
              <div className="bp-skeleton-bar title-2" />
            </div>

            <div className="bp-byline">
              <span>By <strong>AeroXplore Aviator</strong></span>
              <span className="bp-byline-sep">·</span>
              <span className="bp-read-time">Flight telemetry standby</span>
            </div>

            <div className="bp-paper-rule thin" />

            <div className="bp-hero-img-wrap bp-skeleton-hero">
              <div className="bp-skeleton-hero-fill" />
            </div>

            <div className="bp-paper-rule thin" />

            <div className="bp-content bp-skeleton-content">
              <div className="bp-skeleton-bar para-1" />
              <div className="bp-skeleton-bar para-2" />
              <div className="bp-skeleton-bar para-3" />
              <div className="bp-skeleton-bar para-4" />
            </div>
          </div>
        )}
        </div>
      </main>
      <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.75rem', color: '#888', background: '#0a0a0a' }}>
        I'm here to help spark ideas and provide a great starting point, but for anything mission-critical, it’s always a good move to double-check with official documentation or expert sources just to be safe!
      </div>
    </div>
  </>
);
}
