export function validatePassword(pw) {
  const length = pw.length >= 6;
  const special = /[^A-Za-z0-9\s]/.test(pw);
  return { length, special, valid: length && special };
}

// The server stores "opened"; "ready" vs "locked" is recalculated live in the browser
export function liveStatus(c) {
  if (c.status === "opened") return "opened";
  return new Date(c.unlockAt) <= new Date() ? "ready" : "locked";
}

export function timeLeft(iso) {
  const diff = new Date(iso) - new Date();
  const mins = Math.max(1, Math.ceil(diff / 60000));
  const days = Math.floor(mins / 1440);
  const hours = Math.floor((mins % 1440) / 60);
  const m = mins % 60;

  if (days >= 365) return `${Math.floor(days / 365)}y ${Math.floor((days % 365) / 30)}m`;
  if (days >= 30) return `${Math.floor(days / 30)} months`;
  if (days >= 1) return `${days}d ${hours}h`;
  if (hours >= 1) return `${hours}h ${m}m`;
  return `${m} min`;
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
