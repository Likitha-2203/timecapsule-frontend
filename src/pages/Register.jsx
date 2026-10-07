import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUsers, norm } from "../utils/store";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with a backend API call
    const users = getUsers();
    const mail = norm(email);

    if (users.some((u) => u.email === mail)) {
      alert("An account with this email already exists. Please log in.");
      return;
    }

    users.push({ name: name.trim(), email: mail, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully. Please log in.");
    navigate("/login");
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit" className="auth-btn pink">
            Register
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