import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import Layout from '@components/Layout';
import PostCard from '@components/PostCard';

export default function Home({ initialPosts, initialTotal }) {
  const gridRef = useRef(null);
  const masonryRef = useRef(null);
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length < initialTotal);
  const loadingRef = useRef(false);
  const previousPostCount = useRef(initialPosts.length);

  // Initialize Masonry once
  useEffect(() => {
    const initMasonry = async () => {
      if (
        typeof window !== 'undefined' &&
        gridRef.current &&
        initialPosts.length > 0
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

    const timer = setTimeout(initMasonry, 100);

    return () => {
      clearTimeout(timer);
      if (masonryRef.current) {
        masonryRef.current.destroy();
      }
    };
  }, []);

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
      if (loadingRef.current || !hasMore) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 1500) {
        loadingRef.current = true;
        setLoading(true);
        
        try {
          const nextPage = page + 1;
          const res = await fetch(`/api/posts?page=${nextPage}&limit=25`);
          const data = await res.json();
          
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
  }, [hasMore, page]);

  return (
    <Layout fullWidth  title="Home">
      <div ref={gridRef} className={styles.grid}>
        <div className={styles.gridSizer}></div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading more posts...
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No more posts to load
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  const baseUrl = `http://localhost:3000`;

  try {
    const res = await fetch(`${baseUrl}/api/posts?page=1&limit=25`);
    const data = await res.json();
    const posts = data.data || [];
    const total = data.pagination?.total || 0;

    return {
      props: {
        initialPosts: posts,
        initialTotal: total,
      },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: {
        initialPosts: [],
        initialTotal: 0,
      },
    };
  }
}
