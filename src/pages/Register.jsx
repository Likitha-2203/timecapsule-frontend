import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { validatePassword } from "../utils/format";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const pw = validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!pw.valid) {
      setError("Password must be at least 6 characters and include a special symbol.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({ name, email, password });
      navigate("/verify-email", { state: { email: res.email } });
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
        <h2>Create Account</h2>
        <p className="auth-sub">Start saving your memories</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
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

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-btn pink" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
