// src/lib/api.js
const API_BASE = "http://localhost:5000"

function getToken() {
  return localStorage.getItem('token');
}

export async function apiFetch(path, { method = 'GET', headers = {}, body = null, skipAuth = false } = {}) {
  const url = `${API_BASE}${path}`;
  const token = getToken();

  const baseHeaders = {
    'Accept': 'application/json',
    ...headers,
  };

  if (!skipAuth && token) {
    baseHeaders['Authorization'] = `Bearer ${token}`;
  }
  if (body && !(body instanceof FormData)) {
    baseHeaders['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const res = await fetch(url, { method, headers: baseHeaders, body, credentials: 'same-origin' });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch (e) { json = { message: text }; }

  if (!res.ok) {
    // If 401: token invalid/expired — handle centrally
    if (res.status === 401) {
      // optional: automatic logout handled by caller (we keep it simple)
      const error = new Error(json?.message || 'Unauthorized');
      error.status = 401;
      throw error;
    }
    const error = new Error(json?.message || 'Request failed');
    error.status = res.status;
    error.payload = json;
    throw error;
  }
  return json;
}
