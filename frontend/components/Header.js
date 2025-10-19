import Link from 'next/link';
import { useUser } from '../context/UserContext';

export default function Header() {
  const { user } = useUser();

  return (
    <nav className="navbar">
      {/* Logo/Title */}
      <div className="navbar-logo">
        <Link href="/">GW2🎨STYLE</Link>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link href="/create" className="navbar-link">
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

        {user?.username ? (
          <div className="navbar-user">
            <Link href="/user" className="navbar-link">
              {user.username}
            </Link>
          </div>
        ) : (
          <Link href="/login" className="navbar-link">
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}
