import axios from "axios";

export const ADMIN_SESSION_KEY = "coffee-admin-session";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5236";

function readAdminSession() {
  const storedSession = localStorage.getItem(ADMIN_SESSION_KEY);

  if (!storedSession || storedSession === "true") {
    return null;
  }

  try {
    return JSON.parse(storedSession);
  } catch {
    return null;
  }
}

function storeAdminSession(session) {
  localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({
      token: session.token,
      expiresAtUtc: session.expiresAtUtc,
      username: session.username,
    })
  );
}

export async function loginAdmin(username, password) {
  const response = await axios.post(`${API_URL}/api/admin/auth/login`, {
    username: username.trim(),
    password,
  });

  storeAdminSession(response.data);
  return response.data;
}

export function logoutAdmin() {
  const token = getAdminToken();
  localStorage.removeItem(ADMIN_SESSION_KEY);

  if (!token) {
    return Promise.resolve();
  }

  return axios
    .post(`${API_URL}/api/admin/auth/logout`, null, {
      headers: getAdminAuthHeader(token),
    })
    .catch(() => {});
}

export function isAdminLoggedIn() {
  const session = readAdminSession();

  if (!session?.token || !session?.expiresAtUtc) {
    return false;
  }

  const expiresAt = new Date(session.expiresAtUtc).getTime();
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export function getAdminToken() {
  if (!isAdminLoggedIn()) {
    return "";
  }

  return readAdminSession()?.token ?? "";
}

export function getAdminAuthHeader(token = getAdminToken()) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isAdminAuthError(error) {
  return error?.response?.status === 401;
}
