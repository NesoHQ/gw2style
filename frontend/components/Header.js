// export default function Header() {
//   return (
//     <nav className="navbar">
//       {/* Logo/Title */}
//       <div className="navbar-logo">
//         <a href="/">
//           GW2🎨STYLE
//         </a>
//       </div>

//       {/* Navigation Links */}
//       <div className="navbar-links">
//         <a href="/" className="navbar-link">
//           Post
//         </a>
//         <a href="/search" className="navbar-link">
//           Search
//         </a>
//         <a href="/about" className="navbar-link">
//           About
//         </a>
//         <a href="/guidelines" className="navbar-link">
//           Submission Guidelines
//         </a>
//         <a href="/login" className="navbar-link">
//           Log In
//         </a>
//       </div>
//     </nav>
//   );
// }

// components/Header.js
// components/Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data); // { id, username }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="navbar">
      {/* Logo/Title */}
      <div className="navbar-logo">
        <Link href="/">GW2🎨STYLE</Link>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link href="/" className="navbar-link">
          Post
        </Link>
        <Link href="/search" className="navbar-link">
          Search
        </Link>
        <Link href="/about" className="navbar-link">
          About
        </Link>
        <Link href="/guidelines" className="navbar-link">
          Submission Guidelines
        </Link>

        {user ? (
          <Link href="/user" className="navbar-link">
            {user.username}
          </Link>
        ) : (
          <Link href="/login" className="navbar-link">
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}
