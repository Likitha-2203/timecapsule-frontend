const BASE = import.meta.env.VITE_API_URL || "https://timecapsule-backend-d5pz.onrender.com/api";
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
    const fullUrl = `${BASE}${path}`;
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
        throw new Error(`Cannot reach backend at ${fullUrl}. (${err.message})`);
    }
        const data = await res.json().catch(() => ({}));

  // Session expired: send the user back to login
        if (res.status === 401 && auth && getToken()) {
            clearSession();
            window.location.href = "/login";
        }
        if (!res.ok) {
            const err = new Error(data.error || "Something went wrong. Please try again.");
            err.data = data;
            throw err;
        }
        return data;
}

export const api = {
    register: (b) => request("/auth/register", { method: "POST", body: b, auth: false }),
    verify: (b) => request("/auth/verify", { method: "POST", body: b, auth: false }),
    resend: (b) => request("/auth/resend", { method: "POST", body: b, auth: false }),
    login: (b) => request("/auth/login", { method: "POST", body: b, auth: false }),
    forgot: (b) => request("/auth/forgot", { method: "POST", body: b, auth: false }),
    reset: (b) => request("/auth/reset", { method: "POST", body: b, auth: false }),

    lookupUser: (email) => request(`/users/lookup?email=${encodeURIComponent(email)}`),
    listCapsules: () => request("/capsules"),
    createCapsule: (b) => request("/capsules", { method: "POST", body: b }),
    openCapsule: (id) => request(`/capsules/${id}/open`, { method: "POST" }),
    deleteCapsule: (id) => request(`/capsules/${id}`, { method: "DELETE" }),
};