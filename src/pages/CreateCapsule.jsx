import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, getAllCapsules, saveAllCapsules, norm } from "../utils/store";
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
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("💌");
  const [sealing, setSealing] = useState(false);

  const minDateTime = toLocalInput(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();

    if (new Date(date) <= new Date()) {
      alert("The unlock date and time must be in the future.");
      return;
    }

    let recipientEmail = user.email;
    let recipientName = user.name;

    if (forSomeone) {
      recipientEmail = norm(toEmail);
      recipientName = toName.trim() || recipientEmail;

      if (recipientEmail === user.email) {
        alert("This is your own email address. Please select 'For Myself' instead.");
        return;
      }
    }

    setSealing(true);

    // TODO: Replace with a backend API call
    const capsule = {
      id: Date.now(),
      title,
      message,
      unlockDate: date,
      mood,
      opened: false,
      senderName: user.name,
      senderEmail: user.email,
      recipientName,
      recipientEmail,
    };
    saveAllCapsules([capsule, ...getAllCapsules()]);

    setTimeout(() => navigate("/my-capsules"), 1800);
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
            <button
              type="button"
              className={!forSomeone ? "active" : ""}
              onClick={() => setForSomeone(false)}
            >
              🙋 For Myself
            </button>
            <button
              type="button"
              className={forSomeone ? "active" : ""}
              onClick={() => setForSomeone(true)}
            >
              🎁 For Someone Else
            </button>
          </div>

          {forSomeone && (
            <>
              <input
                type="text"
                placeholder="Recipient's name"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                style={{ marginTop: 12 }}
                required
              />
              <input
                type="email"
                placeholder="Recipient's email (must match their registered email)"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                style={{ marginTop: 12 }}
                required
              />
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
            maxLength={1000}
            required
          />
          <div className="char-count">{message.length} / 1000</div>

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

          <button className="seal-btn" type="submit" disabled={sealing}>
            {sealing
              ? "Sealing your capsule... 🔒"
              : forSomeone
              ? "🎁 Seal & Send"
              : "🔒 Seal Capsule"}
          </button>
        </form>

        {/* LIVE PREVIEW */}
        <div className="preview-card">
          <h4>Live Preview</h4>
          <div className={`mini-capsule ${sealing ? "sealing" : ""}`}>{mood}</div>
          <div className="preview-title">{title || "Your capsule title"}</div>
          <div className="preview-to">
            {forSomeone ? `To: ${toName || "..."}` : "To: Future me"}
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