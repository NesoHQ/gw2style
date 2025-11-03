import { useState, useEffect } from 'react';
import Layout from '@components/Layout';
import styles from '../styles/Styles.module.css';

export default function StylesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: '',
    author: '',
    tag: '',
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchParams.query) queryParams.append('q', searchParams.query);
      if (searchParams.author)
        queryParams.append('author', searchParams.author);
      if (searchParams.tag) queryParams.append('tag', searchParams.tag);

      const response = await fetch(
        `/api/posts/search?${queryParams.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch posts');
      }

      setPosts(data.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchParams({
      query: formData.get('query') || '',
      author: formData.get('author') || '',
      tag: formData.get('tag') || '',
    });
  };

  return (
    <Layout
      title="Browse Styles"
      description="Browse and search Guild Wars 2 fashion styles"
    >
      <div className="page-header">
        <h1 className="page-title">Browse Styles</h1>
        <p className="page-description">
          Discover amazing fashion styles created by the Guild Wars 2 community
        </p>
      </div>

      <main className={styles.main}>
        <section className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInputs}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="query"
                  placeholder="Search by title or description..."
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="author"
                  placeholder="Filter by author..."
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="tag"
                  placeholder="Filter by tag..."
                  className={styles.searchInput}
                />
              </div>
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </div>
          </form>
        </section>

        <section className={styles.resultsSection}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : posts.length > 0 ? (
            <div className={styles.grid}>
              {posts.map((post) => (
                <article key={post.id} className={styles.post}>
                  <a href={`/posts/${post.id}`} className={styles.postLink}>
                    <div className={styles.imageContainer}>
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className={styles.thumbnail}
                      />
                    </div>
                    <div className={styles.postInfo}>
                      <h2 className={styles.postTitle}>{post.title}</h2>
                      <p className={styles.postMeta}>
                        by {post.author_name} • {post.likes_count} likes
                      </p>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              No posts found. Try adjusting your search criteria.
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
