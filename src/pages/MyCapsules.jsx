import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getUser,
  getAllCapsules,
  saveAllCapsules,
  isMine,
  isSentByMe,
  getStatus,
  timeLeft,
  formatDateTime,
} from "../utils/store";
import "./Capsules.css";

function MyCapsules() {
  const user = getUser();
  const [capsules, setCapsules] = useState(getAllCapsules);
  const [tab, setTab] = useState("received");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [shakeId, setShakeId] = useState(null);
  const [toast, setToast] = useState("");
  const [, setTick] = useState(0);

  // Re-render every 20 seconds so statuses update automatically
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 20000);
    return () => clearInterval(id);
  }, []);

  const save = (list) => {
    setCapsules(list);
    saveAllCapsules(list);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const received = capsules.filter((c) => isMine(c, user));
  const sent = capsules.filter((c) => isSentByMe(c, user));

  const handleClick = (c) => {
    const status = getStatus(c);

    // Sent capsules: the sender cannot read the message, only see its status
    if (tab === "sent") {
      showToast(
        status === "locked"
          ? `🎁 Will be delivered to ${c.recipientName} in ${timeLeft(c.unlockDate)}`
          : status === "opened"
          ? `💌 ${c.recipientName} has opened this capsule`
          : `✅ Delivered to ${c.recipientName}`
      );
      return;
    }

    if (status === "locked") {
      setShakeId(c.id);
      setTimeout(() => setShakeId(null), 400);
      showToast(`🔒 Locked. ${timeLeft(c.unlockDate)} remaining`);
      return;
    }

    if (status === "ready") {
      save(capsules.map((x) => (x.id === c.id ? { ...x, opened: true } : x)));
    }
    setSelected(c);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this capsule?")) {
      save(capsules.filter((c) => c.id !== id));
    }
  };

  const list =
    tab === "received"
      ? received.filter((c) => filter === "all" || getStatus(c) === filter)
      : sent;

  return (
    <div className="cap-page">
      <div className="cap-top">
        <div className="cap-logo">
          ✉ Time<span>Capsule</span>
        </div>
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
      </div>

      <div className="cap-heading">
        <h1>My Capsules 📦</h1>
        <p>{user?.name}, all your memories in one place</p>
      </div>

      <div className="tab-row">
        <button
          className={tab === "received" ? "active" : ""}
          onClick={() => setTab("received")}
        >
          📥 Received ({received.length})
        </button>
        <button
          className={tab === "sent" ? "active" : ""}
          onClick={() => setTab("sent")}
        >
          📤 Sent ({sent.length})
        </button>
      </div>

      {tab === "received" && (
        <div className="filter-row">
          {["all", "locked", "ready", "opened"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <div className="empty-box">
          <div className="big">📭</div>
          <p>
            {tab === "received"
              ? "No capsules here yet"
              : "You have not sent any capsules yet"}
          </p>
          <Link to="/create">＋ Create a capsule</Link>
        </div>
      ) : (
        <div className="cap-grid">
          {list.map((c) => {
            const status = getStatus(c);
            const fromOther = c.senderEmail && c.senderEmail !== user?.email;
            return (
              <div
                key={c.id}
                className={`cap-card ${status} ${shakeId === c.id ? "shake" : ""}`}
                onClick={() => handleClick(c)}
              >
                <button className="del-btn" onClick={(e) => handleDelete(e, c.id)}>🗑</button>
                <div className="cap-emoji">{c.mood}</div>
                <h3>{c.title}</h3>

                {tab === "received" && fromOther && (
                  <div className="who-tag">🎁 From: {c.senderName}</div>
                )}
                {tab === "sent" && (
                  <div className="who-tag">📤 To: {c.recipientName}</div>
                )}

                <div className="cap-date">Opens {formatDateTime(c.unlockDate)}</div>

                <span className={`badge ${status}`}>
                  {tab === "received" && status === "locked" && `🔒 ${timeLeft(c.unlockDate)} left`}
                  {tab === "received" && status === "ready" && "✨ Ready to open!"}
                  {tab === "received" && status === "opened" && "💌 Opened"}
                  {tab === "sent" && status === "locked" && `🚚 Delivers in ${timeLeft(c.unlockDate)}`}
                  {tab === "sent" && status === "ready" && "✅ Delivered"}
                  {tab === "sent" && status === "opened" && "💌 Opened by recipient"}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="modal-bg" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="m-emoji">{selected.mood}</div>
            <h2>{selected.title}</h2>
            <div className="cap-date">
              {selected.senderEmail && selected.senderEmail !== user?.email
                ? `A message from ${selected.senderName}`
                : "A message from your past self"}
            </div>
            <div className="modal-msg">{selected.message}</div>
            <button className="close-btn" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default MyCapsules;