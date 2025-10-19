import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import styles from '../styles/CreatePost.module.css';

export default function CreatePost() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    image1_url: '',
    image2_url: '',
    image3_url: '',
    image4_url: '',
    image5_url: '',
  });

  // Redirect if not logged in
  if (typeof window !== 'undefined' && !user) {
    router.push('/login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.thumbnail_url.trim()) {
      setError('At least one image URL is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          published: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      router.push('/posts/' + data.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Create New Post - GW2Style</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>Create New Post</h1>

        <div className={styles.formContainer}>
          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={250}
                placeholder="Give your creation a name"
                required
              />
              <span className={styles.charCount}>
                {formData.title.length}/250
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Share the story behind your design..."
                rows={5}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="thumbnail_url">
                Main Image URL (Thumbnail) *
              </label>
              <input
                type="url"
                id="thumbnail_url"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleInputChange}
                placeholder="https://..."
                required
              />
              <span className={styles.hint}>
                This will be the main image shown in the gallery
              </span>
            </div>

            {[1, 2, 3, 4, 5].map((num) => (
              <div className={styles.formGroup} key={num}>
                <label htmlFor={`image${num}_url`}>
                  Additional Image {num} URL
                </label>
                <input
                  type="url"
                  id={`image${num}_url`}
                  name={`image${num}_url`}
                  value={formData[`image${num}_url`]}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
            ))}

            <div className={styles.note}>
              <p>
                * Required fields
                <br />
                Note: Your character's equipment details will be automatically
                fetched from your Guild Wars 2 account using your API key.
              </p>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
