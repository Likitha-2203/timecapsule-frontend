export const norm = (s) => (s || "").trim().toLowerCase();

export function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

export function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

export function getAllCapsules() {
  return JSON.parse(localStorage.getItem("capsules") || "[]");
}

export function saveAllCapsules(list) {
  localStorage.setItem("capsules", JSON.stringify(list));
}

// Capsules addressed to the current user (including ones they sent to themselves)
export function isMine(c, user) {
  return !!user && c.recipientEmail === user.email;
}

// Capsules the current user sent to someone else
export function isSentByMe(c, user) {
  return (
    !!user &&
    c.senderEmail === user.email &&
    c.recipientEmail !== user.email
  );
}

export function getStatus(c) {
  if (c.opened) return "opened";
  return new Date(c.unlockDate) <= new Date() ? "ready" : "locked";
}

export function timeLeft(dateStr) {
  const diff = new Date(dateStr) - new Date();
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

export function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}