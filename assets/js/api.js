window.API_BASE = "https://gadgeto-backend.onrender.com";
function authHeaders() {
  const token = localStorage.getItem("token");
  const h = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

function fallbackResponse() {
  return { ok: false, status: 0, json: async () => ({}), text: async () => "" };
}

const api = {
  get: async (url, opts = {}) => {
    try {
      return await fetch(`${window.API_BASE}${url}`, { headers: authHeaders(), ...opts });
    } catch (e) {
      return fallbackResponse();
    }
  },
  post: async (url, data, opts = {}) => {
    try {
      return await fetch(`${window.API_BASE}${url}`, { method: "POST", headers: authHeaders(), body: JSON.stringify(data || {}), ...opts });
    } catch (e) {
      return fallbackResponse();
    }
  },
  put: async (url, data, opts = {}) => {
    try {
      return await fetch(`${window.API_BASE}${url}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data || {}), ...opts });
    } catch (e) {
      return fallbackResponse();
    }
  },
  delete: async (url, opts = {}) => {
    try {
      return await fetch(`${window.API_BASE}${url}`, { method: "DELETE", headers: authHeaders(), ...opts });
    } catch (e) {
      return fallbackResponse();
    }
  },
};

const authApi = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    return data;
  },
  register: async (email, password, full_name) => api.post("/auth/register", { email, password, full_name }),
};
