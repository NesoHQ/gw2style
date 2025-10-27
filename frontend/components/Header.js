import Link from 'next/link';
import { useUser } from '../context/UserContext';

export default function Header() {
  const { user } = useUser();

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link href="/">
            <span className="logo-text">
              <b>GW2</b>style
            </span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="header-nav">
          <Link href="/styles" className="nav-link">
            Styles
          </Link>
          <Link href="/create" className="nav-link">
            Create
          </Link>
          <Link href="/popular" className="nav-link">
            Popular
          </Link>
          <Link href="/guidelines" className="nav-link">
            Guidelines
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="header-actions">
          <button className="icon-button" aria-label="Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          {user?.username ? (
            <Link href="/user" className="user-profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="username">{user.username}</span>
            </Link>
          ) : (
            <Link href="/login" className="login-button">
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
