import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, getUser } from "../api";
import "./Capsules.css";

const MOODS = ["💌", "🎉", "❤️", "🎯", "🌟", "😢"];

function toLocalInput(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

function addMonths(months) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return toLocalInput(d);
}

function addMinutes(min) {
  return toLocalInput(new Date(Date.now() + min * 60 * 1000));
}

function CreateCapsule() {
  const navigate = useNavigate();
  const user = getUser();

  const [forSomeone, setForSomeone] = useState(false);
  const [toEmail, setToEmail] = useState("");
  const [recipient, setRecipient] = useState(null); // null = unchecked, {exists, name}
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("💌");
  const [sealing, setSealing] = useState(false);
  const [error, setError] = useState("");

  const minDateTime = toLocalInput(new Date());

  // Check (after the user stops typing) that the recipient has a verified account
  useEffect(() => {
    setRecipient(null);
    const mail = toEmail.trim();
    if (!forSomeone || !/^\S+@\S+\.\S+$/.test(mail)) return;
    const id = setTimeout(() => {
      api.lookupUser(mail).then(setRecipient).catch(() => setRecipient(null));
    }, 500);
    return () => clearTimeout(id);
  }, [toEmail, forSomeone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (new Date(date) <= new Date()) {
      setError("The unlock date and time must be in the future.");
      return;
    }
    if (forSomeone && toEmail.trim().toLowerCase() === user.email) {
      setError("This is your own email address. Please select 'For Myself' instead.");
      return;
    }

    setSealing(true);
    try {
      await api.createCapsule({
        title,
        message,
        mood,
        unlockAt: new Date(date).toISOString(), // converts local time to UTC
        recipientEmail: forSomeone ? toEmail : undefined,
      });
      setTimeout(() => navigate("/my-capsules"), 1500);
    } catch (err) {
      setSealing(false);
      setError(err.message);
    }
  };

  return (
    <div className="cap-page">
      <div className="cap-top">
        <div className="cap-logo">
          ✉ Time<span>Capsule</span>
        </div>
        <Link to="/dashboard" className="back-link">← Dashboard</Link>
      </div>

      <div className="cap-heading">
        <h1>Create a Capsule ✨</h1>
        <p>Write today, open it in the future</p>
      </div>

      <div className="create-grid">
        <form className="form-card" onSubmit={handleSubmit}>
          <label>Who is this for?</label>
          <div className="type-toggle">
            <button type="button" className={!forSomeone ? "active" : ""} onClick={() => setForSomeone(false)}>
              🙋 For Myself
            </button>
            <button type="button" className={forSomeone ? "active" : ""} onClick={() => setForSomeone(true)}>
              🎁 For Someone Else
            </button>
          </div>

          {forSomeone && (
            <>
              <input
                type="email"
                placeholder="Recipient's registered email address"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                style={{ marginTop: 12 }}
                required
              />
              {recipient?.exists && <div className="recipient-ok">✓ Verified account: {recipient.name}</div>}
              {recipient && !recipient.exists && (
                <div className="recipient-bad">
                  No verified account found for this email. They need to register and verify first.
                </div>
              )}
            </>
          )}

          <label>Capsule Title</label>
          <input
            type="text"
            placeholder="Ex: Happy Birthday in 2030!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={40}
            required
          />

          <label>Mood</label>
          <div className="mood-row">
            {MOODS.map((m) => (
              <button
                type="button"
                key={m}
                className={`mood-btn ${mood === m ? "active" : ""}`}
                onClick={() => setMood(m)}
              >
                {m}
              </button>
            ))}
          </div>

          <label>Your Message</label>
          <textarea
            placeholder={
              forSomeone
                ? "Write something special for them..."
                : "Write something your future self will love to read..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={65536}
            required
          />
          <div className="char-count">{message.length.toLocaleString()} / 65,536</div>

          <label>Unlock Date &amp; Time</label>
          <div className="quick-row" style={{ marginBottom: 12 }}>
            <button type="button" className="quick-btn" onClick={() => setDate(addMinutes(2))}>2 Min (test)</button>
            <button type="button" className="quick-btn" onClick={() => setDate(addMonths(1))}>1 Month</button>
            <button type="button" className="quick-btn" onClick={() => setDate(addMonths(6))}>6 Months</button>
            <button type="button" className="quick-btn" onClick={() => setDate(addMonths(12))}>1 Year</button>
            <button type="button" className="quick-btn" onClick={() => setDate(addMonths(60))}>5 Years</button>
          </div>
          <input
            type="datetime-local"
            value={date}
            min={minDateTime}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          {error && <div className="form-error">{error}</div>}

          <button className="seal-btn" type="submit" disabled={sealing}>
            {sealing ? "Sealing your capsule... 🔒" : forSomeone ? "🎁 Seal & Send" : "🔒 Seal Capsule"}
          </button>
        </form>

        <div className="preview-card">
          <h4>Live Preview</h4>
          <div className={`mini-capsule ${sealing ? "sealing" : ""}`}>{mood}</div>
          <div className="preview-title">{title || "Your capsule title"}</div>
          <div className="preview-to">
            {forSomeone ? `To: ${recipient?.name || toEmail || "recipient"}` : "To: Future me"}
          </div>
          <div className="preview-date">
            {date
              ? `Opens on ${new Date(date).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}`
              : "Select an unlock date & time"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCapsule;
