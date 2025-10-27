import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Main sections */}
        <div className="footer-section footer-brand">
          <h3 className="footer-title">GW2 STYLE</h3>
          <p className="footer-description">
            Unleash your creativity in Tyria. Your ultimate destination for
            Guild Wars 2 fashion, where every character becomes a masterpiece.
            Join our community of style-savvy adventurers.
          </p>
          <div className="footer-social">
            <a
              href="https://github.com/nesohq/gw2style"
              target="_blank"
              rel="noopener noreferrer"
              className="github-button"
            >
              <svg
                height="20"
                width="20"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              Join the Revolution
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Fashion Arena</h4>
          <ul className="footer-links">
            <li>
              <Link href="/">Trending Looks</Link>
            </li>
            <li>
              <Link href="/create">Forge Your Style</Link>
            </li>
            <li>
              <Link href="/popular">Hall of Fame</Link>
            </li>
            <li>
              <Link href="/guidelines">Style Guide</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">The Wardrobe</h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://discord.com/invite/xvArbFbh34"
                target="_blank"
                rel="noopener noreferrer"
              >
                Community
                <span className="new-tag">Discord</span>
              </a>
            </li>
            <li>
              <a
                href="https://github.com/nesohq/gw2style/discussions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fashion Forum
              </a>
            </li>
            <li>
              <a
                href="https://github.com/nesohq/gw2style/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                Feedback Forge
              </a>
            </li>
            <li>
              <a
                href="https://github.com/nesohq/gw2style/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join the Artisans
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Style Arsenal</h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://guildwars2.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                GW2 Universe
              </a>
            </li>
            <li>
              <a
                href="https://wiki.guildwars2.com/wiki/Main_Page"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fashion Wiki
              </a>
            </li>
            <li>
              <a
                href="https://wiki.guildwars2.com/wiki/Dye"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dye Chronicles
              </a>
            </li>
            <li>
              <a
                href="https://wiki.guildwars2.com/wiki/Wardrobe"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wardrobe Guide
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom section */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            Crafted & Powered by NesoHQ
          </p>
          <div className="footer-bottom-links">
            <a
              href="https://github.com/nesohq"
              target="_blank"
              rel="noopener noreferrer"
            >
              NesoHQ
            </a>
            <span className="separator">✧</span>
            <a
              href="https://github.com/nesohq/gw2style"
              target="_blank"
              rel="noopener noreferrer"
            >
              Behind the Seams
            </a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer {
          background: #1a202c;
          color: #e2e8f0;
          padding: 4rem 2rem 1rem;
          margin-top: 4rem;
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
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1rem;
          background: linear-gradient(45deg, #3498db, #2ecc71);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-description {
          color: #a0aec0;
          line-height: 1.6;
          margin-bottom: 1.5rem;
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

        .github-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #24292e;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .github-button:hover {
          background: #2c333a;
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
            padding: 3rem 1rem 1rem;
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
