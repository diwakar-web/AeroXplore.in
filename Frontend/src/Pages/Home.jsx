import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Home.css';
import useScrollReveal from '../hooks/useScrollReveal';
import logo from '../assets/logo.png';

const featuredPost = {
  id: 'f-15',
  title: "The Eagle’s Dominion: The Unrivaled Legacy of the F-15",
  date: 'April 18, 2026',
  author: 'Diwakar Nagar',
  caption: 'McDonnell Douglas F-15',
  para1:`The McDonnell Douglas (now Boeing) F-15 Eagle remains the undisputed king of the skies, a reputation cemented by its legendary combat score of 104-0. Over five decades of operation, no F-15 has ever been shot down by an enemy aircraft in aerial combat. The aircraft's journey began with the F-15A (single-seat) and F-15B (two-seat trainer), which were pure air-superiority machines designed under the strict philosophy of \"not a pound for air-to-ground.\" These were followed by the F-15C and F-15D, which introduced the \"Production Eagle Package,\" including increased internal fuel and the ability to carry conformal fuel tanks, significantly extending their range and endurance for long-range patrols.`,
  para2:`At high altitudes, the Eagle can attain a blistering speed of Mach 2.5 (approximately 1,900 mph), powered by its twin-engine configuration. The platform has historically relied on two primary powerplants: the Pratt & Whitney F100 series, which powered the original A through D models, and the General Electric F110-GE-129, which has become the \"engine of choice\" for the newest heavy-duty variants. These engines provide the massive thrust-to-weight ratio required to out-accelerate almost any threat, allowing the Eagle to maintain its dominance even as newer generations of fighters emerge.`
};

const blogPosts = [
  {
    id: 'tejas_1',
    title: 'Tejas: Pride, Payloads, and Production Bottlenecks',
    date: 'April 14, 2026',
    author: 'Diwakar Nagar',
    image: '/images/tejas.jpg',
    category: 'Defence Aviation',
  },
  {
    id: '5th gen',
    title: 'The Fifth-Generation Dilemma: Su-57 Felon vs. F-35 Lightning II',
    date: 'April 13, 2026',
    author: 'Diwakar Nagar',
    image: '/images/su57-f35.jpg',
    category: 'Defence Aviation',
  },
  {
    id: 'drone',
    title: "The Drone Revolution: Precision, Attrition, and India's Path to Sovereignty",
    date: 'Apri 13, 2026',
    author: 'Diwakar Nagar',
    image: '/images/drone.jpg',
    category: 'Unmanned Systems',
  },
  
];

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function Home() {
  useScrollReveal();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');
  const [contactLoading, setContactLoading] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (data.success) {
        setContactSent(true);
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setContactSent(false), 5000);
      } else {
        setContactError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setContactError('Unable to reach the server. Please try again later.');
    } finally {
      setContactLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeLoading(true);
    setSubscribeError('');
    try {
      const res = await fetch(`${API_BASE}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscribed(true);
        setSubscribeEmail('');
        setTimeout(() => setSubscribed(false), 6000);
      } else {
        setSubscribeError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubscribeError('Unable to reach the server. Please try again later.');
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <div className="AeroXplore-root">

      <section className="newspaper-section">
        <div className="paper-texture-overlay"></div>
        <div className="newspaper-inner">

          <div className="newspaper-hero">

            <div className="newspaper-masthead" data-reveal="fade-in">
              <div className="masthead-rule thick"></div>
              <div className="masthead-rule thin"></div>
              <h1 className="masthead-title">
                <img
                  src={logo}
                  alt="AeroXplore"
                  className="masthead-logo-img"
                />
              </h1>
              <p className="masthead-subtitle">The Premier Aviation &amp; Aerospace Chronicle</p>
              <div className="masthead-rule thin"></div>
              <div className="masthead-info-row">
                <span className="masthead-info">Est. April, 2026</span>
                <span className="masthead-info">Vol. I · No. 47</span>
                <span className="masthead-info">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="masthead-info">By Diwakar Nagar</span>
              </div>
              <div className="masthead-rule thick"></div>
            </div>

            <div className="section-label-row" data-reveal="fade-in" style={{ '--reveal-delay': '0.1s' }}>
              <div className="section-label-line"></div>
              <span className="section-label-text">Featured Dispatch</span>
              <div className="section-label-line"></div>
            </div>

            <article className="featured-article">
              <div className="featured-left" data-reveal="fade-left" style={{ '--reveal-delay': '0.15s' }}>
                <h2 className="featured-headline">{featuredPost.title}</h2>
                <div className="featured-byline">
                  <span className="byline-author">By {featuredPost.author}</span>
                  <span className="byline-sep">·</span>
                  <span className="byline-date">{featuredPost.date}</span>
                </div>
                <div className="featured-rule"></div>
                <p className="featured-para">{featuredPost.para1}</p>
                <p className="featured-para">{featuredPost.para2}</p>
                <a href={`/blog/${featuredPost.id}`} className="read-more-link" id="featured-read-more">
                  Click here to read more →
                </a>
              </div>
              <div className="featured-right" data-reveal="fade-right" style={{ '--reveal-delay': '0.3s' }}>
                <div className="featured-photo-frame">
                  <img
                    src="/images/f-15.jpg"
                    alt="Featured Article"
                    className="featured-photo"
                  />
                  <p className="featured-caption">{featuredPost.caption}</p>
                </div>
              </div>
            </article>

          </div>

          <div className="newspaper-below-fold">

            <div className="section-label-row" data-reveal="fade-in">
              <div className="section-label-line"></div>
              <span className="section-label-text">Recent Dispatches</span>
              <div className="section-label-line"></div>
            </div>

            <div className="blog-cards-grid">
              {blogPosts.map((post, i) => (
                <Link
                  to={`/blog/${post.id}`}
                  key={post.id}
                  className="blog-card"
                  id={`blog-card-${post.id}`}
                  data-reveal="fade-up"
                  style={{ '--reveal-delay': `${i * 0.1}s` }}
                >
                  <div className="blog-card-img-wrap">
                    <img src={post.image} alt={post.title} className="blog-card-img" />
                    <span className="blog-card-category">{post.category}</span>
                  </div>
                  <div className="blog-card-body">
                    <h3 className="blog-card-title">{post.title}</h3>
                    <div className="blog-card-meta">
                      <span className="blog-card-date">{post.date}</span>
                      <span className="blog-card-sep">·</span>
                      <span className="blog-card-author">{post.author}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="view-all-wrap" data-reveal="fade-up" style={{ '--reveal-delay': '0.2s' }}>
              <Link to="/blogs" className="view-all-btn" id="view-all-dispatches-btn">
                View All Dispatches →
              </Link>
            </div>

          </div>

        </div>
      </section>

      <section className="motive-section" id="motive">
        <div className="motive-inner">
          <div className="motive-header" data-reveal="fade-in">
            <div className="motive-rule"></div>
            <h2 className="motive-heading">Motive Behind AeroXplore</h2>
            <div className="motive-rule"></div>
          </div>

          <div className="motive-content">
            <div className="motive-text-block" data-reveal="fade-up" style={{ '--reveal-delay': '0.1s' }}>
              <h3 className="motive-subheading">Why I Created AeroXplore</h3>
              <p className="motive-para">
                Aviation has always been more than machines and mathematics to me, it is the closest thing humanity has to
                a physical metaphor for ambition. Growing up in India, I was mesmerised by the contrails streaking across
                the sky, each one a silent argument that the universe is larger and more navigable than we imagine. I
                started <em>AeroXplore</em> because I believe that complex aerospace concepts, news and theories deserve to be explained
                with the same passion that pilots feel when they break through cloud cover and find blue sky above.
                This is my attempt to bridge the gap between engineering classrooms and curious minds.
              </p>
            </div>

            <div className="motive-text-block" data-reveal="fade-up" style={{ '--reveal-delay': '0.25s' }}>
              <h3 className="motive-subheading">Where You Can Find Me</h3>
              <p className="motive-para">
                I am <strong>Diwakar Nagar</strong> a B.Tech student, an aviation enthusiast, and a constant learner.
                When I’m not exploring concepts of aerodynamics or diving into technical knowledge, you’ll find me showcasing my achievements on
                <strong> LinkedIn</strong> staying active on <strong>Twitter / X</strong>, by posting and reposting almost everything related to aviation, and sharing my passion for flight and technology on
                <strong>Instagram</strong>
                My interests revolve around aviation engineering, space exploration, defense technology, and the evolving world of aerospace. I enjoy staying updated, sharing insights, and being part of conversations that push the boundaries of innovation.
                I believe growth, like flight, is limitless when you keep moving forward.
              </p>
              <div className="social-links-row">
                <a href="https://www.linkedin.com/in/diwakarnagar/" className="social-chip" id="social-linkedin" target='blank'>LinkedIn</a>
                <a href="https://x.com/diwakar_nagar01" className="social-chip" id="social-twitter" target='blank'>Twitter / X</a>
                <a href="https://www.instagram.com/diwakar_nagar01" className="social-chip" id="social-instagram" target='blank'>Instagram</a>
                <a href="https://github.com/diwakar-web" className="social-chip" id="social-github" target='blank'>GitHub</a>
              </div>
            </div>
          </div>

          <div className="newsletter-box" id="newsletter-box" data-reveal="scale-up">
            <div className="newsletter-box-inner">
              <div className="newsletter-icon">✈</div>
              <h3 className="newsletter-title">Stay in the Slipstream</h3>
              <p className="newsletter-desc">
                Get the latest AeroXplore dispatches delivered to your inbox, aviation deep-dives, defence mission summaries,
                and engineering breakdowns, curated for curious minds.
              </p>
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email address"
                  value={subscribeEmail}
                  onChange={(e) => { setSubscribeEmail(e.target.value); setSubscribeError(''); }}
                  required
                  disabled={subscribeLoading}
                  id="newsletter-email-input"
                />
                <button
                  type="submit"
                  className={`newsletter-btn${subscribeLoading ? ' btn-loading' : ''}`}
                  id="newsletter-submit-btn"
                  disabled={subscribeLoading || subscribed}
                >
                  {subscribeLoading ? '⏳ Sending...' : subscribed ? '✓ Subscribed!' : 'Subscribe'}
                </button>
              </form>
              {subscribed && <p className="form-success-msg">Welcome aboard! You're now on the manifest. 🛫</p>}
              {subscribeError && <p className="form-error-msg">⚠ {subscribeError}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <div className="contact-header" data-reveal="fade-in">
            <h2 className="contact-heading">Contact Me</h2>
            <p className="contact-subheading">
              Have a question, a story idea, or just want to talk aviation? I'm always happy to connect.
            </p>
            <div className="contact-rule"></div>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit} id="contact-form" data-reveal="fade-up" style={{ '--reveal-delay': '0.15s' }}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  type="text"
                  id="contact-name"
                  placeholder="e.g. Arjun Verma"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email Address</label>
                <input
                  type="email"
                  id="contact-email"
                  placeholder="you@example.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Your Message</label>
              <textarea
                id="contact-message"
                rows="6"
                placeholder="Tell me what's on your mind..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className={`contact-submit-btn${contactLoading ? ' btn-loading' : ''}`}
              id="contact-submit-btn"
              disabled={contactLoading || contactSent}
            >
              {contactLoading ? '⏳ Sending...' : contactSent ? '✓ Message Sent!' : 'Send Message →'}
            </button>
            {contactSent && <p className="form-success-msg">Message received! I'll get back to you shortly. ✈</p>}
            {contactError && <p className="form-error-msg">⚠ {contactError}</p>}
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-paper-texture"></div>
        <div className="footer-inner">
          <div className="footer-masthead-rule thick"></div>
          <div className="footer-masthead-rule thin"></div>

          <p className="footer-tagline">The Premier Aviation &amp; Aerospace Chronicle</p>

          <div className="footer-masthead-rule thin"></div>

          <div className="footer-columns">
            <div className="footer-col">
              <h4 className="footer-col-title">Navigate</h4>
              <ul className="footer-links">
                <li><a href="/" id="footer-home">Home</a></li>
                <li><Link to="/blogs" id="footer-articles">Dispatches</Link></li>
                <li><a href="#motive" id="footer-about">About</a></li>
                <li><a href="#contact" id="footer-contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">Dispatches</h4>
              <ul className="footer-links">
                {blogPosts.slice(0, 4).map(p => (
                  <li key={p.id}>
                    <Link to={`/blog/${p.id}`} id={`footer-post-${p.id}`}>{p.title.substring(0, 38)}…</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-col-title">The Correspondent</h4>
              <p className="footer-bio">
                Diwakar Nagar — aviation enthusiast, engineering student, and  blogger. Writing about the skies so you
                can understand them better.
              </p>
              <div className="footer-social">
                <a href="https://www.linkedin.com/in/diwakarnagar/" className="footer-social-link" id="footer-linkedin">in</a>
                <a href="https://x.com/diwakar_nagar01" className="footer-social-link" id="footer-twitter">𝕏</a>
                <a href="https://www.instagram.com/diwakar_nagar01" className="footer-social-link" id="footer-instagram">ig</a>

              </div>
            </div>
          </div>

          <div className="footer-masthead-rule thin"></div>
          <div className="footer-bottom">
            <span>© 2026 AeroXplore.in · Diwakar Nagar · All Rights Reserved</span>
            <span className="footer-bottom-right">Crafted with passion for aviation ✈</span>
          </div>
          <div className="footer-masthead-rule thick"></div>
        </div>
      </footer>
      <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.75rem', color: '#888', background: '#0a0a0a' }}>
I'm here to help spark ideas and provide a great starting point, but for anything mission-critical, it’s always a good move to double-check with official documentation or expert sources just to be safe!      </div>

    </div>
  );
}
