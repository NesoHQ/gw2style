import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Decorative divider */}
      <div className="footer-divider">
        <div className="divider-line"></div>
        <div className="divider-diamonds">
          <span className="diamond">◆</span>
          <span className="diamond">◆</span>
          <span className="diamond">◆</span>
          <span className="diamond">◆</span>
          <span className="diamond">◆</span>
        </div>
        <div className="divider-line"></div>
      </div>

      <div className="footer-content">
        {/* Main sections */}
        <div className="footer-section footer-brand">
          <h3 className="footer-title">GW2STYLE</h3>
          <p className="footer-description">
            A community-driven fashion archive for Guild Wars 2 players. 
            Showcase your character outfits, browse creative looks, and get 
            inspired by the fashion of Tyria. Free, open-source, and built 
            to celebrate creativity within the GW2 community.
          </p>
          
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Explore</h4>
          <ul className="footer-links">
            <li>
              <Link href="/">Browse Gallery</Link>
            </li>
            <li>
              <Link href="/create">Share Your Style</Link>
            </li>
            <li>
              <Link href="/popular">Popular Posts</Link>
            </li>
            <li>
              <Link href="/about">About Project</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Community</h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://discord.com/invite/xvArbFbh34"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord Server
              </a>
            </li>
            <li>
              <a
                href="https://github.com/nesohq/gw2style/discussions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discussions
              </a>
            </li>
            <li>
              <a
                href="https://github.com/nesohq/gw2style/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report Issues
              </a>
            </li>
            <li>
              <a
                href="https://github.com/nesohq/gw2style"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute on GitHub
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Resources</h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://guildwars2.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Guild Wars 2
              </a>
            </li>
            <li>
              <a
                href="https://wiki.guildwars2.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                GW2 Wiki
              </a>
            </li>
            <li>
              <a
                href="https://account.arena.net/applications"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get API Key
              </a>
            </li>
            <li>
              <a
                href="https://github.com/nesohq/gw2style/blob/main/README.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            © {currentYear} GW2Style • Built by{' '}
            <a
              href="https://github.com/nesohq"
              target="_blank"
              rel="noopener noreferrer"
            >
              NesoHQ
            </a>
          </p>
          <div className="footer-bottom-links">
            <a
              href="https://github.com/nesohq/gw2style"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Source
            </a>
            <span className="separator">•</span>
            <span className="tech-stack">Go + Next.js + PostgreSQL</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer {
          background: linear-gradient(180deg, #0f1419 0%, #1a202c 100%);
          color: #e2e8f0;
          padding: 0 2rem 1rem;
          margin-top: 4rem;
          position: relative;
        }

        .footer-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
          gap: 1rem;
        }

        .divider-line {
          flex: 1;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
          max-width: 400px;
        }

        .divider-diamonds {
          display: flex;
          gap: 1rem;
        }

        .diamond {
          color: #d4af37;
          font-size: 0.75rem;
          animation: shimmer 3s ease-in-out infinite;
        }

        .diamond:nth-child(1) { animation-delay: 0s; }
        .diamond:nth-child(2) { animation-delay: 0.2s; }
        .diamond:nth-child(3) { animation-delay: 0.4s; }
        .diamond:nth-child(4) { animation-delay: 0.6s; }
        .diamond:nth-child(5) { animation-delay: 0.8s; }

        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
        }

        .footer-brand {
          max-width: 400px;
        }

        .footer-title {
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1rem;
          background: linear-gradient(135deg, #d4af37, #cd7f32);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-description {
          color: #a0aec0;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .footer-badges {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-block;
          padding: 0.375rem 0.75rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 6px;
          color: #d4af37;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .footer-heading {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 1rem;
          color: #fff;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.75rem;
        }

        .footer-links a {
          color: #a0aec0;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #fff;
        }

        .footer-copyright a {
          color: #d4af37;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-copyright a:hover {
          color: #f4d03f;
        }

        .tech-stack {
          color: #4a5568;
          font-size: 0.85rem;
        }

        .footer-bottom {
          margin-top: 4rem;
          padding-top: 2rem;
          border-top: 1px solid #2d3748;
        }

        .footer-bottom-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #718096;
          font-size: 0.9rem;
        }

        .footer-bottom-links {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .footer-bottom-links a {
          color: #718096;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-bottom-links a:hover {
          color: #fff;
        }

        .separator {
          color: #4a5568;
        }

        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }

          .footer-brand {
            grid-column: 1 / -1;
            max-width: none;
          }
        }

        @media (max-width: 640px) {
          .footer {
            padding: 0 1rem 1rem;
          }

          .footer-divider {
            padding: 1.5rem 0;
          }

          .divider-line {
            max-width: 100px;
          }

          .divider-diamonds {
            gap: 0.5rem;
          }

          .diamond {
            font-size: 0.6rem;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-bottom-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
