import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import Layout from '@components/Layout';
import PostCard from '@components/PostCard';
import { postsApi } from '../utils/postsApi';

export default function Home() {
  const gridRef = useRef(null);
  const masonryRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const previousPostCount = useRef(0);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch initial posts on mount
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        setLoading(true);
        const data = await postsApi.getPosts(1, 25);

        if (data.success && data.data) {
          setPosts(data.data);
          setHasMore(data.pagination?.page < data.pagination?.total_pages);
          previousPostCount.current = data.data.length;
        }
      } catch (error) {
        console.error('Error fetching initial posts:', error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    fetchInitialPosts();
  }, []);

  // Initialize Masonry once posts are loaded
  useEffect(() => {
    const initMasonry = async () => {
      if (
        typeof window !== 'undefined' &&
        gridRef.current &&
        posts.length > 0 &&
        !masonryRef.current
      ) {
        try {
          const Masonry = (await import('masonry-layout')).default;
          const imagesLoaded = (await import('imagesloaded')).default;

          imagesLoaded(gridRef.current, () => {
            masonryRef.current = new Masonry(gridRef.current, {
              itemSelector: `.${styles.card}`,
              columnWidth: `.${styles.gridSizer}`,
              percentPosition: true,
              transitionDuration: '0.3s',
              fitWidth: true,
            });
          });
        } catch (error) {
          console.log('Masonry not available, using CSS Grid fallback');
        }
      }
    };

    if (!initialLoad && posts.length > 0) {
      const timer = setTimeout(initMasonry, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      if (masonryRef.current) {
        masonryRef.current.destroy();
      }
    };
  }, [posts, initialLoad]);

  // Append new items to Masonry when posts change
  useEffect(() => {
    const appendToMasonry = async () => {
      if (
        masonryRef.current &&
        gridRef.current &&
        posts.length > previousPostCount.current
      ) {
        try {
          const imagesLoaded = (await import('imagesloaded')).default;

          // Get all card elements
          const allCards = Array.from(gridRef.current.querySelectorAll(`.${styles.card}`));
          // Get only the new ones
          const newCards = allCards.slice(previousPostCount.current);

          if (newCards.length > 0) {
            imagesLoaded(newCards, () => {
              masonryRef.current.appended(newCards);
              masonryRef.current.layout();

              // Fade in new cards after layout
              newCards.forEach(card => {
                card.style.transition = 'opacity 0.3s ease-in';
                card.style.opacity = '1';
              });
            });
          }

          previousPostCount.current = posts.length;
        } catch (error) {
          console.log('Error appending to masonry:', error);
        }
      }
    };

    appendToMasonry();
  }, [posts]);

  useEffect(() => {
    const handleScroll = async () => {
      if (loadingRef.current || !hasMore || initialLoad) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 1500) {
        loadingRef.current = true;
        setLoading(true);

        try {
          const nextPage = page + 1;
          const data = await postsApi.getPosts(nextPage, 25);

          if (data.success && data.data.length > 0) {
            setPosts(prev => {
              const existingIds = new Set(prev.map(p => p.id));
              const newPosts = data.data.filter(p => !existingIds.has(p.id));
              return [...prev, ...newPosts];
            });
            setPage(nextPage);
            setHasMore(data.pagination.page < data.pagination.total_pages);
          } else {
            setHasMore(false);
          }
        } catch (error) {
          console.error('Error loading more posts:', error);
        } finally {
          setLoading(false);
          loadingRef.current = false;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, page, initialLoad]);

  return (
    <Layout fullWidth title="Home">
      {initialLoad ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonCard}></div>
            <div className={styles.skeletonCard}></div>
            <div className={styles.skeletonCard}></div>
            <div className={styles.skeletonCard}></div>
          </div>
        </div>
      ) : (
        <>
          <div ref={gridRef} className={styles.grid}>
            <div className={styles.gridSizer}></div>
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                style={{
                  opacity: !initialLoad && index >= previousPostCount.current ? 0 : 1
                }}
              />
            ))}
          </div>
          {loading && !initialLoad && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              Loading more posts...
            </div>
          )}
          {!hasMore && posts.length > 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No more posts to load
            </div>
          )}
          {!loading && posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No posts found
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
