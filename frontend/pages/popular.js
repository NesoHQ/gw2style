import { useState, useEffect } from 'react';
import Layout from '@components/Layout';
import styles from '../styles/Popular.module.css';

export default function PopularPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all'); // 'all', 'week', 'month'

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

  return (
    <Layout
      title="Popular"
      description="Top 100 most popular Guild Wars 2 fashion styles"
    >
      <div className="page-header">
        <h1 className="page-title">Popular Styles</h1>
        <p className="page-description">
          The most loved fashion styles from our amazing community
        </p>
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>Top 100 Popular Styles</h1>

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
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.leaderboard}>
            {posts.map((post, index) => (
              <article key={post.id} className={styles.leaderboardItem}>
                <div className={styles.rank}>#{index + 1}</div>
                <a href={`/posts/${post.id}`} className={styles.postLink}>
                  <div className={styles.thumbnail}>
                    <img src={post.thumbnail} alt={post.title} />
                  </div>
                  <div className={styles.postInfo}>
                    <h2 className={styles.postTitle}>{post.title}</h2>
                    <p className={styles.postMeta}>
                      by {post.author_name} • {post.likes_count} likes •{' '}
                      {post.views} views
                    </p>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}
