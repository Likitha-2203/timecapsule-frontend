import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUsers, norm } from "../utils/store";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with a backend API call
    const user = getUsers().find(
      (u) => u.email === norm(email) && u.password === password
    );

    if (!user) {
      alert("Incorrect email or password. If you are new, please register first.");
      return;
    }

    localStorage.setItem("token", "logged-in");
    localStorage.setItem(
      "user",
      JSON.stringify({ name: user.name, email: user.email })
    );
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          ✉ Time<span>Capsule</span>
        </div>
        <h2>Welcome Back</h2>
        <p className="auth-sub">Log in to open your capsules</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn purple">
            Login
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;