const BASE = process.env.REACT_APP_API_BASE;

// ------------------------------
// Inject JWT Automatically
// ------------------------------
function getHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }
    : { "Content-Type": "application/json" };
}

// ------------------------------
// Generic Request Handler
// ------------------------------
async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {}

  if (!res.ok) {
    throw new Error(data.error || "API Error");
  }

  return data;
}

// ------------------------------
// MEMBERS API
// ------------------------------
export const membersAPI = {
  list: () => request("/members"),
  create: (m) => request("/members", { method: "POST", body: JSON.stringify(m) }),
  update: (id, m) =>
    request(`/members/${id}`, { method: "PUT", body: JSON.stringify(m) }),
  remove: (id) => request(`/members/${id}`, { method: "DELETE" }),
};

// ------------------------------
// LOANS API
// ------------------------------
export const loansAPI = {
  list: () => request("/loans"),
  get: (id) => request(`/loans/${id}`),
  create: (payload) =>
    request("/loans", { method: "POST", body: JSON.stringify(payload) }),
  repay: (id, payload) =>
    request(`/loans/${id}?action=repay`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/loans/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => request(`/loans/${id}`, { method: "DELETE" }),
};

// ------------------------------
// AUTH API (NO TOKEN)
// ------------------------------
export const authAPI = {
  register: (data) =>
    fetch(BASE + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const t = await res.text();
      const json = t ? JSON.parse(t) : {};
      if (!res.ok) throw new Error(json.error || "Register failed");
      return json;
    }),

  login: (data) =>
    fetch(BASE + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const t = await res.text();
      const json = t ? JSON.parse(t) : {};
      if (!res.ok) throw new Error(json.error || "Login failed");
      return json;
    }),
};

