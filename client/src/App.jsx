import { useState } from "react";

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

function App() {
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) ?? "",
  );
  const [authUser, setAuthUser] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("register");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    setAuthError("");
    setAuthMessage("");

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
        <button type="button" onClick={() => setMode("register")}>
          Register
        </button>

        <button type="button" onClick={() => setMode("login")}>
          Login
        </button>
      </div>
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

export default App;
