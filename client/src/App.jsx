import { Routes, Route, Link, Navigate } from "react-router-dom";
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

function AuthScreen({ mode, setAuthToken, setAuthUser }) {
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError("");
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
      // WHY (Code Style): authMessage state was removed because setting authToken triggers an immediate route redirect — the success message never renders on screen before the component unmounts. Unused state adds noise to the component. The redirect itself signals success.
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
      {authError ? <p style={{ color: "crimson" }}>{authError}</p> : null}
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

function getTargetServiceFromSourceUrl(sourceUrl) {
  if (!sourceUrl.trim()) {
    return "";
  }

  try {
    const { hostname } = new URL(sourceUrl.trim());

    if (hostname.includes("spotify.com")) {
      return "youtube";
    }

    if (
      hostname.includes("youtube.com") ||
      hostname.includes("music.youtube.com") ||
      hostname === "youtu.be"
    ) {
      return "spotify";
    }

    return "";
  } catch {
    return "";
  }
}

function DashboardPage({ authUser, onLogout }) {
  const [sourceUrl, setSourceUrl] = useState("");
  const targetService = getTargetServiceFromSourceUrl(sourceUrl);
  const [convertError, setConvertError] = useState("");
  const [convertResult, setConvertResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);

  async function handleConvertSubmit(event) {
    event.preventDefault();
    setConvertError("");
    setConvertResult(null);

    if (!targetService) {
      setConvertError("Paste a Spotify or YouTube track URL.");
      return;
    }
    setIsConverting(true);

    try {
      const response = await fetch(`${API_BASE}/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sourceUrl, targetService }),
      });

      const data = await readJsonResponse(response);
      setConvertResult(data);
    } catch (error) {
      setConvertError(error.message);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      {authUser ? (
        <>
          <p>Signed in as {authUser.email}</p>
          <button type="button" onClick={onLogout}>
            Log Out
          </button>
        </>
      ) : (
        <div>
          <p>Using the converter as a guest.</p>
          <Link to="/register">Register</Link>
          <Link to="/login">Log in</Link>
        </div>
      )}
      <form onSubmit={handleConvertSubmit}>
        <label>
          Source URL
          <input
            type="url"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            placeholder={
              targetService === "youtube"
                ? "https://open.spotify.com/track/..."
                : targetService === "spotify"
                  ? "https://www.youtube.com/watch?v=..."
                  : "Paste a Spotify or YouTube track URL"
            }
          />
        </label>
        <p>
          {targetService === "youtube"
            ? "Detected Spotify link. Converting to YouTube."
            : targetService === "spotify"
              ? "Detected YouTube link. Converting to Spotify."
              : "Paste a Spotify or YouTube track URL to choose the target automatically."}
        </p>
        <button
          type="submit"
          disabled={isConverting || !sourceUrl.trim() || !targetService}
        >
          {isConverting
            ? "Converting..."
            : targetService
              ? `Convert to ${targetService === "youtube" ? "YouTube" : "Spotify"}`
              : "Paste a supported URL"}
        </button>
      </form>

      {convertError ? <p style={{ color: "crimson" }}>{convertError}</p> : null}

      {convertResult ? (
        <section>
          <h2>Conversion Result</h2>

          <p>Source: {convertResult.sourceService}</p>
          <p>Track: {convertResult.sourceTrack?.title}</p>
          <p>Artist: {convertResult.sourceTrack?.primaryArtist}</p>

          <p>Target: {convertResult.targetService}</p>
          <p>Match: {convertResult.targetTrack?.title}</p>

          {convertResult.targetService === "youtube" ? (
            <p>Channel: {convertResult.targetTrack?.channelTitle}</p>
          ) : (
            <p>Artist: {convertResult.targetTrack?.primaryArtist}</p>
          )}

          <a
            href={
              convertResult.targetService === "youtube"
                ? convertResult.targetTrack?.url
                : convertResult.targetTrack?.sourceUrl
            }
            target="_blank"
            rel="noreferrer"
          >
            {convertResult.targetService === "youtube"
              ? "Open YouTube result"
              : "Open Spotify result"}
          </a>
        </section>
      ) : null}
      <section>
        <h2>Conversion History</h2>
        {authUser ? (
          <p>Your saved conversions will appear here in a later update.</p>
        ) : (
          <p>
            Log in or register if you want to save conversions and view them
            later.
          </p>
        )}
      </section>
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

        // WHY (Code Style): removed console.log — debug logs in shipped code expose internal error details in DevTools. Non-abort errors here (e.g. server temporarily unreachable) are treated as non-critical; the user stays in their current state until the next restore attempt.
      }
    }

    restoreSession();

    return () => {
      controller.abort();
    };
  }, [authToken]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={<DashboardPage authUser={authUser} onLogout={handleLogout} />}
      />

      {/* WHY (Documentation): this comment documents existing behavior — the route guard was already here. Noting it explicitly so the intent is clear: logged-in users are redirected away from /register and /login. authToken is the stored string; the restoreSession effect validates it against the server asynchronously. */}
      <Route
        path="/register"
        element={
          authToken ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthScreen
              mode="register"
              setAuthToken={setAuthToken}
              setAuthUser={setAuthUser}
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
              setAuthUser={setAuthUser}
            />
          )
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
