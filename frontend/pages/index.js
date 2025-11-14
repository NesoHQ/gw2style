import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import Layout from '@components/Layout';
import PostCard from '@components/PostCard';

function PostSection({ posts, sectionIndex }) {
  const gridRef = useRef(null);
  const masonryRef = useRef(null);

  useEffect(() => {
    const initMasonry = async () => {
      if (
        typeof window !== 'undefined' &&
        gridRef.current &&
        posts.length > 0
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
  }, [posts]);

  return (
    <div ref={gridRef} className={styles.grid}>
      <div className={styles.gridSizer}></div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default function Home({ initialPosts, initialTotal }) {
  const [postSections, setPostSections] = useState([initialPosts]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length < initialTotal);
  const loadingRef = useRef(false);

  useEffect(() => {
    const handleScroll = async () => {
      if (loadingRef.current || !hasMore) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 500) {
        loadingRef.current = true;
        setLoading(true);
        
        try {
          const nextPage = page + 1;
          const res = await fetch(`/api/posts?page=${nextPage}&limit=25`);
          const data = await res.json();
          
          console.log('Loading page:', nextPage, 'Got posts:', data.data?.length);
          console.log('Post IDs:', data.data?.map(p => p.id).join(', '));
          console.log('Pagination:', data.pagination);
          
          if (data.success && data.data.length > 0) {
            setPostSections(prev => [...prev, data.data]);
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
      {postSections.map((posts, index) => (
        <PostSection key={index} posts={posts} sectionIndex={index} />
      ))}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading more posts...
        </div>
      )}
      {!hasMore && postSections.length > 0 && (
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
