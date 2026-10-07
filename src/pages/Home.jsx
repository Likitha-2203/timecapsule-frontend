import { Link } from "react-router-dom";
import "./Home.css";

function Capsule() {
  return (
    <svg viewBox="0 0 260 460" className="capsule-svg">
      <defs>
        <linearGradient id="purple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b79cff" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ede9fe" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="scroll" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff4dc" />
          <stop offset="100%" stopColor="#f1d3a0" />
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f0b48a" />
          <stop offset="50%" stopColor="#c47a4a" />
          <stop offset="100%" stopColor="#f0b48a" />
        </linearGradient>
      </defs>

      {/* glass body */}
      <rect x="40" y="120" width="180" height="220" fill="url(#glass)" stroke="#c4b5fd" strokeWidth="2" />
      {/* scroll */}
      <rect x="92" y="150" width="76" height="170" rx="34" fill="url(#scroll)" />
      <rect x="110" y="160" width="60" height="150" rx="28" fill="#f6dfb4" opacity="0.8" />
      <rect x="90" y="228" width="80" height="9" rx="4" fill="#d97706" opacity="0.7" />
      <text x="130" y="262" textAnchor="middle" fontSize="48" fill="#ec4899">♥</text>
      {/* top cap */}
      <path d="M40 120 A90 90 0 0 1 220 120 Z" fill="url(#purple)" />
      <text x="130" y="85" textAnchor="middle" fontSize="26" fill="#4c1d95">♥</text>
      {/* bottom cap */}
      <path d="M40 340 A90 90 0 0 0 220 340 Z" fill="url(#purple)" />
      {/* gold rings */}
      <rect x="36" y="112" width="188" height="18" rx="9" fill="url(#gold)" />
      <rect x="36" y="330" width="188" height="18" rx="9" fill="url(#gold)" />
      {/* shine */}
      <ellipse cx="70" cy="230" rx="8" ry="80" fill="#fff" opacity="0.35" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="home">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">✉</span>
          <span className="logo-text">
            Time<span>Capsule</span>
          </span>
        </div>
        <div className="nav-links">
          <Link to="/" className="active">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <span className="note note-1">Small<br />messages...</span>
          <span className="note note-2">Big dreams<br />for tomorrow...</span>
          <span className="spark s1">✦</span>
          <span className="spark s2">✦</span>
          <span className="spark s3">✦</span>
          <span className="spark s4">✦</span>
          <span className="heart h1">♥</span>
          <span className="heart h2">♥</span>
          <div className="capsule-wrap">
            <Capsule />
          </div>
        </div>

        <div className="hero-right">
          <h1 className="title">
            Time<span>Capsule</span>
          </h1>
          <h2 className="tagline">
            Write a message today.<br />
            Open it in the future. <span className="heart-icon">♡</span>
          </h2>
          <p className="desc">
            TimeCapsule lets you save your thoughts, dreams and special
            moments — and unlock them when the time is right.
          </p>
          <div className="btn-row">
            <Link to="/login" className="btn btn-login">👤 Login</Link>
            <Link to="/register" className="btn btn-register">➕ Register</Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <footer className="features">
        <div className="feature">🔒 <span>Secure &amp; Private</span></div>
        <div className="divider" />
        <div className="feature">🕒 <span>Set Future Date</span></div>
        <div className="divider" />
        <div className="feature">♡ <span>Keep Your Memories Alive</span></div>
      </footer>
    </div>
  );
}