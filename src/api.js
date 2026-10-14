const rawBase = import.meta.env.VITE_API_URL || "https://timecapsule-backend-a7a3.onrender.com";
const BASE = rawBase.replace(/\/+$/, "").replace(/\/api$/, "");
export const getToken = () => localStorage.getItem("token");

export function getUser() {
try {
    return JSON.parse(localStorage.getItem("user") || "null");
} catch {
    return null;
}
}

export function saveSession({ token, user }) {
localStorage.setItem("token", token);
localStorage.setItem("user", JSON.stringify(user));
}

export function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const fullUrl = `${BASE}${normalizedPath}`;
    let res;
    try {
        console.log(`[TimeCapsule API] Calling: ${method} ${fullUrl}`);
        res = await fetch(fullUrl, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(auth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch (err) {
        console.error(`[TimeCapsule API] Network error calling ${fullUrl}:`, err);
        throw new Error(
            `Cannot connect to backend at ${fullUrl}. If the server is on Render free tier, it may take 1-2 minutes to wake up from cold start. Please retry shortly.`
        );
    }

    let data;
    try {
        data = await res.json();
    } catch {
        data = {};
    }

    // Session expired: send the user back to login
    if (res.status === 401 && auth && getToken()) {
        clearSession();
        window.location.href = "/login";
    }

    if (!res.ok) {
        let msg = data.error || data.message;
        if (!msg) {
            if (res.status === 502 || res.status === 504) {
                msg = "Backend service is currently starting up (cold start). Please wait 30 seconds and try again.";
            } else if (res.status === 404) {
                msg = "Requested endpoint not found. Please verify backend deployment.";
            } else if (res.status === 403) {
                msg = "Access forbidden.";
            } else if (res.status === 400) {
                msg = "Invalid request details.";
            } else {
                msg = `Server returned status ${res.status}. Please try again.`;
            }
        }
        const err = new Error(msg);
        err.data = data;
        err.status = res.status;
        throw err;
    }
    return data;
}

export const api = {
    register: (b) => request("/api/auth/register", { method: "POST", body: b, auth: false }),
    verify: (b) => request("/api/auth/verify", { method: "POST", body: b, auth: false }),
    resend: (b) => request("/api/auth/resend", { method: "POST", body: b, auth: false }),
    login: (b) => request("/api/auth/login", { method: "POST", body: b, auth: false }),
    forgot: (b) => request("/api/auth/forgot", { method: "POST", body: b, auth: false }),
    reset: (b) => request("/api/auth/reset", { method: "POST", body: b, auth: false }),

    lookupUser: (email) => request(`/api/users/lookup?email=${encodeURIComponent(email)}`),
    listCapsules: () => request("/api/capsules"),
    createCapsule: (b) => request("/api/capsules", { method: "POST", body: b }),
    openCapsule: (id) => request(`/api/capsules/${id}/open`, { method: "POST" }),
    deleteCapsule: (id) => request(`/api/capsules/${id}`, { method: "DELETE" }),
};