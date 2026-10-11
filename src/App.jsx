import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import CreateCapsule from "./pages/CreateCapsule";
import MyCapsules from "./pages/MyCapsules";
import ProtectedRoute from "./ProtectedRoute";

function Home() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="logo">
          ✉ Time<span>Capsule</span>
        </div>

        <div className="nav-links">
          <Link to="/" className="active">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      <div className="hero">
        <div className="capsule-image-area">
          <img
            src="/timecapsule-illustration.png"
            alt="TimeCapsule"
            className="capsule-image"
          />
        </div>

        <div className="hero-content">
          <h1>
            Time<span>Capsule</span>
          </h1>

          <h2>
            Write a message today.
            <br />
            Open it in the future. <span>♡</span>
          </h2>

          <p>
            TimeCapsule lets you save your thoughts, dreams
            <br />
            and special moments — and unlock them
            <br />
            when the time is right.
          </p>

          <div className="hero-buttons">
            <Link to="/login">
              <button className="login-button">♙ &nbsp; Login</button>
            </Link>

            <Link to="/register">
              <button className="register-button">♙ &nbsp; Register</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="features">
        <div>🔒 &nbsp; Secure &amp; Private</div>
        <div className="line"></div>
        <div>◷ &nbsp; Set Future Date</div>
        <div className="line"></div>
        <div>♡ &nbsp; Keep Your Memories Alive</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateCapsule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-capsules"
          element={
            <ProtectedRoute>
              <MyCapsules />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;