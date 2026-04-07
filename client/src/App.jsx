import { useEffect, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');


function App() {
  const [healthMessage, setHealthMessage] = useState('Checking API...');
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${API_BASE}/health`);
        const text = await res.text();

        if (!res.ok) throw new Error(text || 'Health check failed');
        setHealthMessage(text);
      } catch (err) {
        setError(err.message);
      }
    }

    checkHealth();
  }, []);

  return (
    <main>
      <h1>API Status</h1>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : <p>{healthMessage}</p>}
    </main>
  );
}

export default App;
