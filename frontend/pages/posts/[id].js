import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@components/Layout';
import styles from '../../styles/Post.module.css';

export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`http://localhost:3000/api/posts/${params.id}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch post');
    }

    return {
      props: {
        post: data.data || data,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        post: null,
      },
    };
  }
}

export default function PostDetail({ post }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!post) {
    return (
      <Layout>
        <Head>
          <title>Post not found - GW2Style</title>
        </Head>
        <main className={styles.main}>
          <h1>Post not found</h1>
        </main>
      </Layout>
    );
  }

  // Collect all available images
  const images = [post.thumbnail, post.image1, post.image2, post.image3, post.image4, post.image5].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Layout>
      <Head>
        <title>{post.title} - GW2Style</title>
        <meta name="description" content={post.description} />
      </Head>

      <main className={styles.main}>
        <article className={styles.post}>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <span className={styles.author}>By {post.author_name || 'Anonymous'}</span>
              <span className={styles.date}>
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className={styles.likes}>
                ❤️ {new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(post.likes_count)} likes
              </span>
            </div>
          </header>

          <div className={styles.content}>
            {/* Image Carousel */}
            <div className={styles.carousel}>
              <div className={styles.carouselContainer}>
                <Image
                  src={images[currentImageIndex]}
                  alt={`${post.title} - Image ${currentImageIndex + 1}`}
                  width={1200}
                  height={0}
                  style={{ width: '100%', height: 'auto' }}
                  priority
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      className={`${styles.carouselButton} ${styles.prev}`}
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      className={`${styles.carouselButton} ${styles.next}`}
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                    
                    <div className={styles.carouselIndicators}>
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`${styles.indicator} ${
                            index === currentImageIndex ? styles.active : ''
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className={styles.description}>
              <h2>Description</h2>
              <p>{post.description}</p>
            </div>

            {/* Equipment */}
            {post.equipments && Object.keys(post.equipments).length > 0 && (
              <div className={styles.equipment}>
                <h2>Equipment</h2>
                <pre>{JSON.stringify(post.equipments, null, 2)}</pre>
              </div>
            )}
          </div>
        </article>
      </main>
    </Layout>
  );
}
