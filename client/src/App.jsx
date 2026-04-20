import { useEffect, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

const TOKEN_KEY = 'uml.auth.token';


function App() {
  const [authToken, setAuthToken] = useState(()=> localStorage.getItem(TOKEN_KEY) ?? '');
  const [authUser, setAuthUser] = useState(null);
  const [authMessage, setAuthMessage] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  async function checkHealth() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/health?t=${Date.now()}`, {
        cache: 'no-store',
      });
      const text = await res.text();

      if (!res.ok) throw new Error(text || 'Health check failed');
      setHealthMessage(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <main>
      <h1>API Status</h1>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : <p>{healthMessage}</p>}
      <button onClick={checkHealth} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Health Check'}
      </button>
    </main>
  );
}

export default App;
