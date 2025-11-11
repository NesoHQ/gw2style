import { useState, useEffect, useRef } from 'react';
import Layout from '@components/Layout';
import PostCard from '@components/PostCard';
import styles from '../styles/Popular.module.css';
import homeStyles from '../styles/Home.module.css';

export default function PopularPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all'); // 'all', 'week', 'month'
  
  // Masonry grid refs
  const gridRef = useRef(null);
  const masonryRef = useRef(null);

  useEffect(() => {
    fetchPopularPosts();
  }, [timeframe]);

  const fetchPopularPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/posts/popular?timeframe=${timeframe}&limit=100`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch popular posts');
      }

      setPosts(data.data || []);
    } catch (error) {
      console.error('Error fetching popular posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize Masonry layout
  useEffect(() => {
    const initMasonry = async () => {
      if (
        typeof window !== 'undefined' &&
        gridRef.current &&
        posts &&
        posts.length > 0
      ) {
        try {
          const Masonry = (await import('masonry-layout')).default;
          const imagesLoaded = (await import('imagesloaded')).default;

          if (masonryRef.current) {
            masonryRef.current.destroy();
          }

          imagesLoaded(gridRef.current, () => {
            masonryRef.current = new Masonry(gridRef.current, {
              itemSelector: `.${homeStyles.card}`,
              columnWidth: `.${homeStyles.gridSizer}`,
              percentPosition: true,
              transitionDuration: '0.3s',
              fitWidth: false,
            });
          });
        } catch (error) {
          console.log('Masonry not available, using CSS Grid fallback');
        }
      }
    };

    const timer = setTimeout(initMasonry, 100);

    return () => {
      clearTimeout(timer);
      if (masonryRef.current) {
        masonryRef.current.destroy();
      }
    };
  }, [posts]);

  return (
    <Layout
      fullWidth
      title="Popular"
      description="Top 100 most popular Guild Wars 2 fashion styles"
    >
      <div className={styles.container}>
        <div className="page-header">
          <h1 className="page-title">Popular Styles</h1>
          <p className="page-description">
            The most loved fashion styles from our amazing community
          </p>
        </div>

        <main className={styles.main}>
          <div className={styles.timeframeSelector}>
            <button
              className={`${styles.timeframeButton} ${
                timeframe === 'all' ? styles.active : ''
              }`}
              onClick={() => setTimeframe('all')}
            >
              All Time
            </button>
            <button
              className={`${styles.timeframeButton} ${
                timeframe === 'month' ? styles.active : ''
              }`}
              onClick={() => setTimeframe('month')}
            >
              This Month
            </button>
            <button
              className={`${styles.timeframeButton} ${
                timeframe === 'week' ? styles.active : ''
              }`}
              onClick={() => setTimeframe('week')}
            >
              This Week
            </button>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <div className={styles.loadingText}>Loading Popular Styles...</div>
            </div>
          ) : posts.length > 0 ? (
            <div ref={gridRef} className={homeStyles.grid}>
              <div className={homeStyles.gridSizer}></div>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>⚔</div>
              <h3 className={styles.noResultsTitle}>No Popular Posts</h3>
              <p className={styles.noResultsMessage}>
                No popular posts found for this timeframe.
              </p>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
