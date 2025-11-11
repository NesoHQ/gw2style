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
            <div className="logo-container">
              
              <svg className="logo-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <path d="M6 24L8 12L12 16L18 8L24 16L28 12L30 24H6Z" fill="url(#logoGradient)" opacity="0.3"/>
                <path d="M6 24L8 12L12 16L18 8L24 16L28 12L30 24M6 24H30M6 24V28H30V24" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="18" cy="8" r="2" fill="url(#logoGradient)"/>
                <circle cx="12" cy="16" r="1.5" fill="url(#logoGradient)"/>
                <circle cx="24" cy="16" r="1.5" fill="url(#logoGradient)"/>
              </svg>
              <span className="logo-text">
                <span className="logo-gw2">GW2</span>
                <span className="logo-style">Style</span>
              </span>
            </div>
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
          {user?.username ? (
            <Link href="/user" className="user-profile" title={user.username}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
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
