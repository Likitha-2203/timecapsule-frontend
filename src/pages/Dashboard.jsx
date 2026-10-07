import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getUser,
  getAllCapsules,
  isMine,
  isSentByMe,
  getStatus,
  timeLeft,
} from "../utils/store";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [capsules, setCapsules] = useState(getAllCapsules);
  const [, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setCapsules(getAllCapsules());
      setTick((t) => t + 1);
    };
    const id = setInterval(refresh, 20000);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const mine = capsules.filter((c) => isMine(c, user));
  const sentCount = capsules.filter((c) => isSentByMe(c, user)).length;

  const total = mine.length;
  const locked = mine.filter((c) => getStatus(c) === "locked").length;
  const ready = mine.filter((c) => getStatus(c) === "ready").length;
  const opened = mine.filter((c) => getStatus(c) === "opened").length;

  const next = mine
    .filter((c) => getStatus(c) === "locked")
    .sort((a, b) => new Date(a.unlockDate) - new Date(b.unlockDate))[0];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dash-page">
      <div className="dash-card">
        <div className="dash-logo">
          ✉ Time<span>Capsule</span>
        </div>

        <h2>Welcome, {user?.name} 👋</h2>
        <p className="dash-sub">Your memories are safe with us</p>

        {ready > 0 && (
          <Link to="/my-capsules" className="ready-banner">
            ✨ {ready} capsule{ready > 1 ? "s are" : " is"} ready to open! Tap here
          </Link>
        )}

        <div className="dash-stats">
          <div className="stat-box">
            <h3>{total}</h3>
            <p>Received 📥</p>
          </div>
          <div className="stat-box">
            <h3>{locked}</h3>
            <p>Locked 🔒</p>
          </div>
          <div className="stat-box">
            <h3>{opened}</h3>
            <p>Opened 💌</p>
          </div>
        </div>

        <p className="sent-line">📤 You have sent <strong>{sentCount}</strong> capsule{sentCount !== 1 ? "s" : ""} to others</p>

        {next && (
          <div className="next-box">
            <span className="next-emoji">{next.mood}</span>
            <div>
              <strong>{next.title}</strong>
              <p>Opens in {timeLeft(next.unlockDate)}</p>
            </div>
          </div>
        )}

        <div className="dash-actions">
          <Link to="/create" className="dash-btn purple">
            ＋ Create Capsule
          </Link>
          <Link to="/my-capsules" className="dash-btn pink">
            📦 My Capsules
          </Link>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;