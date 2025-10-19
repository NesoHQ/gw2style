// // pages/login.js
// import { useState } from 'react';
// import Head from 'next/head';
// import { useRouter } from 'next/router';
// import Header from '@components/Header';

// export default function LoginPage() {
//   const [apiKey, setApiKey] = useState('');
//   const [message, setMessage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(null);
//     setLoading(true);

//     try {
//       const res = await fetch('/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ apiKey }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setMessage({ type: 'error', text: data?.error || 'Login failed' });
//       } else {
//         setMessage({
//           type: 'success',
//           text: 'Login successful. Token saved as HttpOnly cookie.',
//         });

//         // redirect or fetch user profile as needed
//         // example: redirect to homepage or dashboard
//         setTimeout(() => router.push('/'), 600);
//       }
//     } catch (err) {
//       setMessage({ type: 'error', text: 'Network error: ' + err.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <div style={{ maxWidth: 520, margin: '60px auto', padding: 20 }}>
//         <Head>
//           <title>Login</title>
//         </Head>

//         <h1>Login</h1>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="apiKey">API Key</label>
//           <input
//             id="apiKey"
//             type="text"
//             value={apiKey}
//             onChange={(e) => setApiKey(e.target.value)}
//             required
//             style={{
//               display: 'block',
//               width: '100%',
//               padding: '8px',
//               margin: '8px 0 16px',
//             }}
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             style={{ padding: '10px 16px' }}
//           >
//             {loading ? 'Logging in…' : 'Login'}
//           </button>
//         </form>

//         {message && (
//           <p
//             style={{
//               marginTop: 16,
//               color: message.type === 'error' ? 'crimson' : 'green',
//             }}
//           >
//             {message.text}
//           </p>
//         )}

//         <p style={{ marginTop: 16, fontSize: 13, color: '#666' }}>
//           Note: the JWT will be stored in an <code>HttpOnly</code> cookie called{' '}
//           <code>token</code>. It cannot be read by client-side JavaScript.
//         </p>
//       </div>
//     </div>
//   );
// }


// pages/login.js
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@components/Header';

// If you have a user context, pass setUser prop from _app.js
export default function LoginPage({ setUser }) {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data?.error || 'Login failed' });
      } else {
        setMessage({
          type: 'success',
          text: 'Login successful! Welcome, ' + data.user.username,
        });

        // Immediately update Header/user state
        if (data.user && setUser) setUser(data.user);

        // Redirect after short delay
        setTimeout(() => router.push('/'), 600);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: 520, margin: '60px auto', padding: 20 }}>
        <Head>
          <title>Login</title>
        </Head>

        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="apiKey">API Key</label>
          <input
            id="apiKey"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            style={{
              display: 'block',
              width: '100%',
              padding: '8px',
              margin: '8px 0 16px',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '10px 16px' }}
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: 16,
              color: message.type === 'error' ? 'crimson' : 'green',
            }}
          >
            {message.text}
          </p>
        )}

        <p style={{ marginTop: 16, fontSize: 13, color: '#666' }}>
          Note: the JWT will be stored in an <code>HttpOnly</code> cookie called{' '}
          <code>token</code>. It cannot be read by client-side JavaScript.
        </p>
      </div>
    </div>
  );
}
