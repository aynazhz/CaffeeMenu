import { useState } from "react";
import { Container } from "react-bootstrap";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { isAdminLoggedIn, loginAdmin } from "./adminAuth";
import "./Admin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await loginAdmin(username, password);
      navigate(location.state?.from?.pathname ?? "/admin", { replace: true });
    } catch (error) {
      console.error("Failed to login admin:", error);
      setError("نام کاربری یا رمز عبور درست نیست.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-page admin-login-page">
      <Container>
        <form className="admin-login-panel" onSubmit={handleSubmit}>
          <span className="admin-eyebrow">پنل مدیریت</span>
          <h1>ورود ادمین</h1>

          <label>
            نام کاربری
            <input
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label>
            رمز عبور
            <input
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error && <p className="admin-form-error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </Container>
    </main>
  );
}
