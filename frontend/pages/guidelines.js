import Layout from '@components/Layout';
import styles from '../styles/Guidelines.module.css';

export default function Guidelines() {
  return (
    <Layout
      title="Submission Guidelines"
      description="Learn how to create and share high-quality fashion posts on GW2Style"
    >
      <div className="page-header">
        <h1 className="page-title">Submission Guidelines</h1>
        <p className="page-description">
          Follow these guidelines to create high-quality fashion posts that the
          community will love
        </p>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Submission Guidelines</h1>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Basic Requirements</h2>
            <ul className={styles.list}>
              <li>
                <strong>GW2 API Key:</strong> You must be logged in with your
                Guild Wars 2 API key to submit posts. This helps us
                automatically fetch your character information and verify
                ownership.
              </li>
              <li>
                <strong>Title:</strong> Give your creation a unique and
                descriptive title (max 250 characters).
              </li>
              <li>
                <strong>Description:</strong> Share the story or inspiration
                behind your look.
              </li>
              <li>
                <strong>Images:</strong> Submit clear, high-quality screenshots
                of your character (up to 5 images).
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Image Guidelines</h2>
            <div className={styles.imageGuidelines}>
              <div className={styles.guideline}>
                <h3>Do</h3>
                <ul className={styles.checkList}>
                  <li>Use high-resolution screenshots</li>
                  <li>Show your character in good lighting</li>
                  <li>Include both full-body and close-up shots</li>
                  <li>Use various angles to showcase details</li>
                  <li>Ensure your character is the main focus</li>
                </ul>
              </div>
              <div className={styles.guideline}>
                <h3>Don't</h3>
                <ul className={styles.xList}>
                  <li>Submit blurry or low-quality images</li>
                  <li>Use heavily modified or edited screenshots</li>
                  <li>Include inappropriate or offensive content</li>
                  <li>Submit images with UI elements visible</li>
                  <li>Use images with excessive post-processing</li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Character Presentation</h2>
            <ul className={styles.list}>
              <li>Ensure your character is well-lit and clearly visible</li>
              <li>
                Consider using different environments that complement your
                design
              </li>
              <li>
                Show your character in both combat and idle poses if relevant
              </li>
              <li>
                Include close-ups of unique design elements or interesting
                details
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Automatic Information</h2>
            <p>
              The following information will be automatically fetched from your
              GW2 account:
            </p>
            <ul className={styles.list}>
              <li>Character name and race</li>
              <li>Armor pieces and their dyes</li>
              <li>Weapons and backpiece</li>
              <li>Outfits and additional cosmetic items</li>
            </ul>
            <p className={styles.note}>
              Note: Make sure your API key has the 'characters' permission
              enabled to allow us to fetch this information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Community Standards</h2>
            <ul className={styles.list}>
              <li>Be respectful to other creators</li>
              <li>Give credit if you're inspired by someone else's design</li>
              <li>Don't spam or post duplicate content</li>
              <li>Keep your content appropriate for all audiences</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Moderation</h2>
            <p>
              Posts that don't meet these guidelines may be removed. Repeated
              violations may result in temporary or permanent posting
              restrictions. If you notice any inappropriate content, please use
              the report feature to notify moderators.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}
