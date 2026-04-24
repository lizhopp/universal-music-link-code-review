import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";


//
const API_BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

const TOKEN_KEY = "uml.auth.token";

function ProtectedRoute({ authToken, authUser, children }) {
  if (authToken && !authUser) {
    return (
      <main>
        <p>Checking session...</p>
      </main>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

async function readJsonResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }
  return data;
}

function AuthScreen({ mode, setAuthToken, authUser, setAuthUser, onLogout }) {
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");
    setSubmitting(true);

    const path = mode === "register" ? "register" : "login";

    try {
      const response = await fetch(`${API_BASE}/users/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await readJsonResponse(response);

      setAuthToken(data.token);
      localStorage.setItem(TOKEN_KEY, data.token);
      setAuthUser(data.user);
      setAuthMessage(data.message);
      setForm({
        email: "",
        password: "",
      });
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>{mode === "register" ? "Create an account" : "Log in"}</h1>

      <div>
        <Link to="/register">Register</Link>

        <Link to="/login">Login</Link>
      </div>
      {authMessage ? <p>{authMessage}</p> : null}
      {authError ? <p style={{ color: "crimson" }}>{authError}</p> : null}
      {authUser ? <p>Signed in as {authUser.email}</p> : null}
      {authUser ? (
        <button type="button" onClick={onLogout}>
          Log Out
        </button>
      ) : null}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting
            ? "Submitting..."
            : mode === "register"
              ? "Create account"
              : "Log in"}
        </button>
      </form>
    </main>
  );
}

function DashboardPage({ authUser, onLogout }) {
  return (
    <main>
      <h1>Dashboard</h1>
      {authUser ? <p>Signed in as {authUser.email}</p> : null}
      <button type="button" onClick={onLogout}>
        Log Out
      </button>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main>
      <h1>Page not found</h1>
    </main>
  );
}

export default function App() {
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) ?? "",
  );
  const [authUser, setAuthUser] = useState(null);

  function handleLogout() {
    setAuthToken("");
    setAuthUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  useEffect(() => {
    if (!authToken) {
      setAuthUser(null);
      return;
    }

    const controller = new AbortController();

    async function restoreSession() {
      try {
        const response = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },

          cache: "no-store",
          signal: controller.signal,
        });

        if (response.status === 401) {
          setAuthToken("");
          setAuthUser(null);
          localStorage.removeItem(TOKEN_KEY);
          return;
        }

        if (!response.ok) {
          throw new Error(`Session restore failed: ${response.status}`);
        }

        const data = await response.json();
        setAuthUser(data.user);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        console.log(error);
      }
    }

    restoreSession();

    return () => {
      controller.abort();
    };
  }, [authToken]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={authToken ? "/dashboard" : "/register"} replace />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute authToken={authToken} authUser={authUser}>
            <DashboardPage authUser={authUser} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          authToken ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthScreen
              mode="register"
              setAuthToken={setAuthToken}
              authUser={authUser}
              setAuthUser={setAuthUser}
              onLogout={handleLogout}
            />
          )
        }
      />
      <Route
        path="/login"
        element={
          authToken ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthScreen
              mode="login"
              setAuthToken={setAuthToken}
              authUser={authUser}
              setAuthUser={setAuthUser}
              onLogout={handleLogout}
            />
          )
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
