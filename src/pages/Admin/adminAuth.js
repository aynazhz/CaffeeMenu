export const ADMIN_SESSION_KEY = "coffee-admin-session";

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "admin123";

export function loginAdmin(username, password) {
  const isValid =
    username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;

  if (isValid) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
  }

  return isValid;
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}
