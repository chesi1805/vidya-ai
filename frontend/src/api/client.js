const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

function getToken() {
    return localStorage.getItem("vidya_token");
}

async function request(path, { method = "GET", body, auth = false } = {}) {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
    }

    return data;
}

export const api = {
    login: (email, password, name) =>
        request("/auth/login", {
            method: "POST",
            body: { email, password, name },
        }),

    signup: (name, email, password) =>
        request("/auth/signup", {
            method: "POST",
            body: { name, email, password },
        }),

    me: () => request("/auth/me", { auth: true }),

    getSubjects: () => request("/subjects"),
    getProgressSummary: () => request("/subjects/progress-summary"),

    getQuiz: (subjectId) => request(`/quizzes/${subjectId}`),

    submitQuiz: (subjectId, answers) =>
        request(`/quizzes/${subjectId}/submit`, {
            method: "POST",
            body: { answers },
        }),

    getNotes: () => request("/notes", { auth: true }),

    addNote: (note) =>
        request("/notes", {
            method: "POST",
            body: note,
            auth: true,
        }),

    deleteNote: (id) =>
        request(`/notes/${id}`, {
            method: "DELETE",
            auth: true,
        }),

    getAssignments: () => request("/assignments", { auth: true }),

    updateAssignment: (id, status) =>
        request(`/assignments/${id}`, {
            method: "PATCH",
            body: { status },
            auth: true,
        }),

    sendChat: (messages) =>
        request("/chat", {
            method: "POST",
            body: { messages },
            auth: true,
        }),
};

export function saveToken(token) {
    localStorage.setItem("vidya_token", token);
}

export function clearToken() {
    localStorage.removeItem("vidya_token");
}

export function hasToken() {
    return Boolean(getToken());
}