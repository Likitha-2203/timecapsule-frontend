import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getUser, clearSession } from "../api";
import { liveStatus, timeLeft } from "../utils/format";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [data, setData] = useState({ received: [], sent: [] });
  const [, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => {
      api.listCapsules().then(setData).catch(() => {});
      setTick((t) => t + 1);
    };
    refresh();
    const id = setInterval(refresh, 20000);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const mine = data.received;
  const total = mine.length;
  const locked = mine.filter((c) => liveStatus(c) === "locked").length;
  const ready = mine.filter((c) => liveStatus(c) === "ready").length;
  const opened = mine.filter((c) => liveStatus(c) === "opened").length;
  const sentCount = data.sent.length;

  const next = mine
    .filter((c) => liveStatus(c) === "locked")
    .sort((a, b) => new Date(a.unlockAt) - new Date(b.unlockAt))[0];

  const handleLogout = () => {
    clearSession();
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
          <div className="stat-box"><h3>{total}</h3><p>Received 📥</p></div>
          <div className="stat-box"><h3>{locked}</h3><p>Locked 🔒</p></div>
          <div className="stat-box"><h3>{opened}</h3><p>Opened 💌</p></div>
        </div>

        <p className="sent-line">
          📤 You have sent <strong>{sentCount}</strong> capsule{sentCount !== 1 ? "s" : ""} to others
        </p>

        {next && (
          <div className="next-box">
            <span className="next-emoji">{next.mood}</span>
            <div>
              <strong>{next.title}</strong>
              <p>Opens in {timeLeft(next.unlockAt)}</p>
            </div>
          </div>
        )}

        <div className="dash-actions">
          <Link to="/create" className="dash-btn purple">＋ Create Capsule</Link>
          <Link to="/my-capsules" className="dash-btn pink">📦 My Capsules</Link>
        </div>

        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
