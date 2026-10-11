import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { api, getUser } from "../api";
import { liveStatus, timeLeft, formatDateTime } from "../utils/format";
import "./Capsules.css";

function MyCapsules() {
  const user = getUser();
  const [data, setData] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("received");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [shakeId, setShakeId] = useState(null);
  const [toast, setToast] = useState("");
  const [, setTick] = useState(0);

  const load = useCallback(async () => {
    try {
      setData(await api.listCapsules());
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Re-render every 20 seconds so locked capsules become "ready" automatically
    const id = setInterval(() => setTick((t) => t + 1), 20000);
    return () => clearInterval(id);
  }, [load]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const handleClick = async (c) => {
    const status = liveStatus(c);

    if (tab === "sent") {
      showToast(
        status === "locked"
          ? `🎁 Will be delivered to ${c.recipientName} in ${timeLeft(c.unlockAt)}`
          : status === "opened"
          ? `💌 ${c.recipientName} has opened this capsule`
          : `✅ Delivered to ${c.recipientName}`
      );
      return;
    }

    if (status === "locked") {
      setShakeId(c.id);
      setTimeout(() => setShakeId(null), 400);
      showToast(`🔒 Locked. ${timeLeft(c.unlockAt)} remaining`);
      return;
    }

    try {
      const full = await api.openCapsule(c.id); // server reveals the message only after unlock
      setSelected({ ...full, unlockAt: c.unlockAt });
      load();
    } catch (err) {
      showToast(err.message);
    }
  };

  const handleDelete = async (e, c) => {
    e.stopPropagation();
    const msg =
      tab === "sent"
        ? "Cancel this capsule? The recipient will not receive it."
        : "Are you sure you want to delete this capsule?";
    if (!window.confirm(msg)) return;
    try {
      await api.deleteCapsule(c.id);
      load();
    } catch (err) {
      showToast(err.message);
    }
  };

  const received = data.received;
  const sent = data.sent;
  const list =
    tab === "received"
      ? received.filter((c) => filter === "all" || liveStatus(c) === filter)
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
        <button className={tab === "received" ? "active" : ""} onClick={() => setTab("received")}>
          📥 Received ({received.length})
        </button>
        <button className={tab === "sent" ? "active" : ""} onClick={() => setTab("sent")}>
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

      {loading ? (
        <div className="empty-box"><p>Loading your capsules...</p></div>
      ) : loadError ? (
        <div className="empty-box"><p>{loadError}</p></div>
      ) : list.length === 0 ? (
        <div className="empty-box">
          <div className="big">📭</div>
          <p>{tab === "received" ? "No capsules here yet" : "You have not sent any capsules yet"}</p>
          <Link to="/create">＋ Create a capsule</Link>
        </div>
      ) : (
        <div className="cap-grid">
          {list.map((c) => {
            const status = liveStatus(c);
            const canDelete = tab === "received" || status === "locked";
            return (
              <div
                key={c.id}
                className={`cap-card ${status} ${shakeId === c.id ? "shake" : ""}`}
                onClick={() => handleClick(c)}
              >
                {canDelete && (
                  <button className="del-btn" onClick={(e) => handleDelete(e, c)}>🗑</button>
                )}
                <div className="cap-emoji">{c.mood}</div>
                <h3>{c.title}</h3>

                {tab === "received" && !c.fromSelf && <div className="who-tag">🎁 From: {c.senderName}</div>}
                {tab === "sent" && <div className="who-tag">📤 To: {c.recipientName}</div>}

                <div className="cap-date">Opens {formatDateTime(c.unlockAt)}</div>

                <span className={`badge ${status}`}>
                  {tab === "received" && status === "locked" && `🔒 ${timeLeft(c.unlockAt)} left`}
                  {tab === "received" && status === "ready" && "✨ Ready to open!"}
                  {tab === "received" && status === "opened" && "💌 Opened"}
                  {tab === "sent" && status === "locked" && `🚚 Delivers in ${timeLeft(c.unlockAt)}`}
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
          <div className="letter" onClick={(e) => e.stopPropagation()}>
            <button className="letter-x" onClick={() => setSelected(null)} aria-label="Close">×</button>
            <div className="letter-head">
              <div className="letter-mood">{selected.mood}</div>
              <h2>{selected.title}</h2>
              <div className="letter-date">{formatDateTime(selected.unlockAt)}</div>
            </div>
            <div className="letter-scroll">
              <p className="letter-dear">Dear {user?.name || "friend"},</p>
              <div className="letter-body">{selected.message}</div>
            </div>
            <div className="letter-seal">♥</div>
            <button className="close-btn letter-close" onClick={() => setSelected(null)}>Close letter</button>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default MyCapsules;
