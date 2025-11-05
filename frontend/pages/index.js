import { useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from '@components/Layout';
import PostCard from '@components/PostCard';

export default function Home({ posts }) {
  const gridRef = useRef(null);
  const masonryRef = useRef(null);

  useEffect(() => {
    const initMasonry = async () => {
      if (
        typeof window !== 'undefined' &&
        gridRef.current &&
        posts &&
        posts.length > 0
      ) {
        try {
          // Dynamic imports for client-side only
          const Masonry = (await import('masonry-layout')).default;
          const imagesLoaded = (await import('imagesloaded')).default;

          // Destroy existing masonry instance
          if (masonryRef.current) {
            masonryRef.current.destroy();
          }

          // Wait for all images to load before initializing masonry
          imagesLoaded(gridRef.current, () => {
            console.log('Images loaded, initializing masonry...');
            masonryRef.current = new Masonry(gridRef.current, {
              itemSelector: `.${styles.card}`,
              columnWidth: `.${styles.gridSizer}`,
              percentPosition: true,
              transitionDuration: '0.3s',
              fitWidth: true,
            });
            console.log('Masonry initialized');
          });
        } catch (error) {
          console.log('Masonry not available, using CSS Grid fallback');
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMasonry, 100);

    return () => {
      clearTimeout(timer);
      if (masonryRef.current) {
        masonryRef.current.destroy();
      }
    };
  }, [posts]);

  return (
    <Layout fullWidth  title="Home">

      <div ref={gridRef} className={styles.grid}>
        <div className={styles.gridSizer}></div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const baseUrl = `http://localhost:3000`;

  try {
    const res = await fetch(`${baseUrl}/api/posts`);
    const data = await res.json();
    const posts = data.data || []; // Assuming our API returns { success: true, data: [...posts] }

    return {
      props: {
        posts: posts || [],
      },
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: {
        posts: [],
      },
    };
  }
}
