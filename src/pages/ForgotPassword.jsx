import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { validatePassword } from "../utils/format";
import "./Auth.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const pw = validatePassword(password);

  const sendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.forgot({ email });
          setInfo("If an account exists for this email, a code has been sent. Please also check your Spam or Junk folder.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!pw.valid) {
      setError("Password must be at least 6 characters and include a special symbol.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.reset({ email, code, password });
      alert("Your password has been reset. Please log in with your new password.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          ✉ Time<span>Capsule</span>
        </div>
        <h2>Reset Password</h2>
        <p className="auth-sub">
          {step === 1 ? "Enter your registered email address" : "Enter the code and choose a new password"}
        </p>

        {step === 1 && (
          <form onSubmit={sendCode}>
            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className="auth-btn purple" disabled={loading}>
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword}>
            {info && <div className="auth-info">{info}</div>}

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6-digit verification code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              required
            />
            <input
              type="password"
              placeholder="New password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <ul className="pw-hints">
              <li className={pw.length ? "ok" : ""}>{pw.length ? "✓" : "○"} At least 6 characters</li>
              <li className={pw.special ? "ok" : ""}>
                {pw.special ? "✓" : "○"} At least one special symbol (e.g. @ # $ ! %)
              </li>
            </ul>

            <input
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className="auth-btn pink" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="auth-switch">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
