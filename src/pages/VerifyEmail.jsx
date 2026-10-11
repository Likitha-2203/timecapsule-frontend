import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { api, saveSession } from "../api";
import "./Auth.css";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // Opened directly without an email: send back to register
  if (!email) return <Navigate to="/register" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await api.verify({ email, code });
      saveSession(res);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    try {
      await api.resend({ email });
          setInfo("A new code has been sent. Please also check your Spam or Junk folder.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          ✉ Time<span>Capsule</span>
        </div>
        <h2>Verify Your Email</h2>
        <p className="auth-sub">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>
        <div className="auth-info">
          📬 Cannot find the email? Please check your <strong>Spam</strong> or{" "}
          <strong>Junk</strong> folder, and mark it as <strong>Not spam</strong>.
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            required
          />

          {info && <div className="auth-info">{info}</div>}
          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn purple" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>

        <p className="auth-switch">
          Did not receive it?{" "}
          <button type="button" className="link-btn" onClick={resend}>
            Resend code
          </button>
        </p>
        <p className="auth-switch">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
