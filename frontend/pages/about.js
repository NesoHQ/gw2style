import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <div className="container">
      <Head>
        <title>About - GW2Style</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>About GW2Style</h1>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>What is GW2Style?</h2>
            <p>
              GW2Style is a community-driven fashion archive for Guild Wars 2
              players. Our platform enables players to showcase their character
              outfits, browse creative looks, and get inspired by the fashion of
              Tyria — all in one place. The platform is free, open-source, and
              built to celebrate creativity within the GW2 community.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Our Mission</h2>
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
            <h2>Core Features</h2>
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
            <h2>Coming Soon</h2>
            <ul className={styles.list}>
              <li>Search and filter posts by tags (race, armor type, theme)</li>
              <li>Like and favorite your preferred styles</li>
              <li>Leaderboard showcasing most-liked posts</li>
              <li>Personal galleries to view all posts by specific players</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Community & Contribution</h2>
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
              >
                Discord community
              </a>{' '}
              to connect with other contributors and stay updated on the
              project's development.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Moderation & Safety</h2>
            <p>We maintain a safe and respectful environment through:</p>
            <ul className={styles.list}>
              <li>User control over their own submissions</li>
              <li>Content reporting system for inappropriate material</li>
              <li>Active moderation to maintain community standards</li>
              <li>Clear submission guidelines and policies</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Features</h2>
            <ul className={styles.list}>
              <li>Post your character designs with high-quality images</li>
              <li>
                Share detailed information about armor and dye combinations
              </li>
              <li>Browse a vast collection of community submissions</li>
              <li>Like and save your favorite styles</li>
              <li>Comment and interact with other creators</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Community Guidelines</h2>
            <p>
              We believe in fostering a positive and supportive community. All
              posts should follow our submission guidelines to maintain quality
              and respect for all users. For more detailed information, please
              visit our Submission Guidelines page.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact</h2>
            <p>
              Have questions or suggestions? We'd love to hear from you! You can
              reach out to us through our official channels or join our
              community Discord server.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
