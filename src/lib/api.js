// Thin fetch wrapper for talking to the StudySphere auth API.
// `credentials: "include"` is required on every call so the browser
// sends/receives the httpOnly session cookie set by the backend.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, { method = "GET", body } = {}) {
  let res;

  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Can't reach the server. Is the backend running on " + API_BASE_URL + "?",
      0,
      null
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // No/invalid JSON body — fine for some responses.
  }

  if (!res.ok) {
    throw new ApiError(data?.message || "Something went wrong.", res.status, data);
  }

  return data;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data; // may contain field-level `errors`
  }
}

export const authApi = {
  signup: (payload) => request("/api/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me"),
};

// Focus sessions: every logged session is stored per-user, per-day on the
// backend — stats (today/week/all-time/streak/day-by-day history) are
// computed from those real records, not hardcoded on a page.
export const focusApi = {
  logSession: (payload) => request("/api/focus/sessions", { method: "POST", body: payload }),
  stats: () => request("/api/focus/stats"),
};

// Organize: subjects + tasks are real per-user records the student
// creates, completes, and deletes — not fixed sample data.
export const organizeApi = {
  listSubjects: () => request("/api/organize/subjects"),
  createSubject: (payload) => request("/api/organize/subjects", { method: "POST", body: payload }),
  deleteSubject: (id) => request(`/api/organize/subjects/${id}`, { method: "DELETE" }),

  listTasks: (date) => request(`/api/organize/tasks${date ? `?date=${date}` : ""}`),
  createTask: (payload) => request("/api/organize/tasks", { method: "POST", body: payload }),
  setTaskCompleted: (id, completed) =>
    request(`/api/organize/tasks/${id}`, { method: "PATCH", body: { completed } }),
  deleteTask: (id) => request(`/api/organize/tasks/${id}`, { method: "DELETE" }),

  summary: () => request("/api/organize/summary"),
};
