import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";


//
const API_BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

const TOKEN_KEY = "uml.auth.token";

async function readJsonResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }
  return data;
}

function AuthScreen({ mode, authToken, setAuthToken, authUser, setAuthUser }) {
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

  function handleLogout() {
    setAuthToken("");
    setAuthUser(null);
    setAuthMessage("");
    setAuthError("");
    localStorage.removeItem(TOKEN_KEY);
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
        <button type="button" onClick={handleLogout}>
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

  useEffect(() => {
    if (!authToken) {
      setAuthUser(null);
      return;
    }

    async function restoreSession() {
      try {
        const response = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await readJsonResponse(response);
        setAuthUser(data.user);
      } catch {
        setAuthToken("");
        setAuthUser(null);
        localStorage.removeItem(TOKEN_KEY);
      }
    }

    restoreSession();
  }, [authToken]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthScreen
            authToken={authToken}
            setAuthToken={setAuthToken}
            authUser={authUser}
            setAuthUser={setAuthUser}
          />
        }
      />
      <Route
        path="/register"
        element={
          <AuthScreen
            mode="register"
            authToken={authToken}
            setAuthToken={setAuthToken}
            authUser={authUser}
            setAuthUser={setAuthUser}
          />
        }
      />
      <Route
        path="/login"
        element={
          <AuthScreen
            mode="login"
            authToken={authToken}
            setAuthToken={setAuthToken}
            authUser={authUser}
            setAuthUser={setAuthUser}
          />
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
