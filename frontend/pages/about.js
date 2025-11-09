import Layout from '@components/Layout';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <Layout title="About GW2Style" description="Learn about GW2Style - A community-driven fashion archive for Guild Wars 2 players">
      <div className="page-header">
        <h1 className="page-title">About GW2Style</h1>
        <p className="page-description">
          A community-driven fashion archive celebrating creativity in Tyria
        </p>
      </div>

      <main className={styles.main}>
        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>◆</span>
              <h2>What is GW2Style?</h2>
            </div>
            <p>
              GW2Style is a community-driven fashion archive for Guild Wars 2
              players. Our platform enables players to showcase their character
              outfits, browse creative looks, and get inspired by the fashion of
              Tyria — all in one place. The platform is free, open-source, and
              built to celebrate creativity within the GW2 community.
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>◆</span>
              <h2>Our Mission</h2>
            </div>
            <p>We strive to:</p>
            <ul className={styles.list}>
              <li>Build a central, free hub for Guild Wars 2 fashion</li>
              <li>Ensure full accessibility and open contribution</li>
              <li>Maintain a self-hosted, transparent architecture</li>
              <li>Encourage collaboration through clear documentation</li>
              <li>Create a platform that celebrates community creativity</li>
            </ul>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>◆</span>
              <h2>Core Features</h2>
            </div>
            <ul className={styles.list}>
              <li>
                Log in using your Guild Wars 2 API key (no password system)
              </li>
              <li>
                Create detailed posts with titles, descriptions, and images
              </li>
              <li>
                Share comprehensive armor info, weapons, and backpack details
              </li>
              <li>
                Browse submissions in a dynamic, infinite-scrolling gallery
              </li>
              <li>Clean, responsive UI that works on all devices</li>
            </ul>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>◆</span>
              <h2>Coming Soon</h2>
            </div>
            <ul className={styles.list}>
              <li>Search and filter posts by tags (race, armor type, theme)</li>
              <li>Like and favorite your preferred styles</li>
              <li>Leaderboard showcasing most-liked posts</li>
              <li>Personal galleries to view all posts by specific players</li>
            </ul>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>◆</span>
              <h2>Community & Contribution</h2>
            </div>
            <p>
              GW2Style is an open-source project that welcomes contributions
              from the community. You can help improve the platform through UI
              design, accessibility enhancements, backend development, or
              documentation.
            </p>
            <p>
              Join our{' '}
              <a
                href="https://discord.com/invite/xvArbFbh34"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord community
              </a>{' '}
              to connect with other contributors and stay updated on the
              project's development.
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>◆</span>
              <h2>Technology Stack</h2>
            </div>
            <p>Built with modern, reliable technologies:</p>
            <ul className={styles.list}>
              <li><strong>Frontend:</strong> Next.js & React for a fast, responsive experience</li>
              <li><strong>Backend:</strong> Go for high-performance API services</li>
              <li><strong>Database:</strong> PostgreSQL for reliable data storage</li>
              <li><strong>Hosting:</strong> Managed k3s cloud infrastructure</li>
              <li><strong>API:</strong> Official Guild Wars 2 API integration</li>
            </ul>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>◆</span>
              <h2>Get Involved</h2>
            </div>
            <p>
              Have questions or suggestions? We'd love to hear from you! You can
              reach out through:
            </p>
            <ul className={styles.list}>
              <li>
                <a
                  href="https://discord.com/invite/xvArbFbh34"
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord Server
                </a> - Join our community
              </li>
              <li>
                <a
                  href="https://github.com/nesohq/gw2style"
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a> - Contribute to the project
              </li>
              <li>
                <a
                  href="https://github.com/nesohq/gw2style/issues"
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report Issues
                </a> - Help us improve
              </li>
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}
