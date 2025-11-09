import { useState } from 'react';
import Head from 'next/head';
import Layout from '@components/Layout';
import EquipmentDisplay from '@components/EquipmentDisplay';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('');

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

  // Separate thumbnail from additional images
  const additionalImages = [post.image1, post.image2, post.image3, post.image4, post.image5].filter(Boolean);

  const getNextIndex = () => (currentImageIndex + 1) % additionalImages.length;
  const getPrevIndex = () => (currentImageIndex - 1 + additionalImages.length) % additionalImages.length;

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection('left');
    setTimeout(() => {
      setCurrentImageIndex(getNextIndex());
      setIsTransitioning(false);
      setDirection('');
    }, 600);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection('right');
    setTimeout(() => {
      setCurrentImageIndex(getPrevIndex());
      setIsTransitioning(false);
      setDirection('');
    }, 600);
  };

  return (
    <Layout>
      <Head>
        <title>GW2Style</title>
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
            {/* Main Thumbnail and Equipment Section */}
            <div className={styles.mainSection}>
              {post.thumbnail && (
                <div className={styles.thumbnailSection}>
                  <h2>Main Image</h2>
                  <div className={styles.thumbnailContainer}>
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className={styles.thumbnail}
                    />
                  </div>
                </div>
              )}

              {/* Equipment */}
              {post.equipments && Object.keys(post.equipments).length > 0 && (
                <div className={styles.equipment}>
                  <h2>Equipment</h2>
                  <EquipmentDisplay equipment={post.equipments} />
                </div>
              )}
            </div>

            {/* Additional Images Carousel */}
            {additionalImages.length > 0 && (
              <div className={styles.carouselSection}>
                <h2>Additional Images ({additionalImages.length})</h2>
                <div className={styles.carousel}>
                  <div className={`${styles.carouselContainer} ${direction ? styles[`sliding-${direction}`] : ''}`}>
                    <div className={styles.carouselTrack}>
                      {direction === 'left' && (
                        <>
                          <img
                            src={additionalImages[currentImageIndex]}
                            alt={`${post.title} - Image ${currentImageIndex + 1}`}
                            className={styles.carouselImage}
                          />
                          <img
                            src={additionalImages[getNextIndex()]}
                            alt={`${post.title} - Image ${getNextIndex() + 1}`}
                            className={styles.carouselImage}
                          />
                        </>
                      )}
                      {direction === 'right' && (
                        <>
                          <img
                            src={additionalImages[getPrevIndex()]}
                            alt={`${post.title} - Image ${getPrevIndex() + 1}`}
                            className={styles.carouselImage}
                          />
                          <img
                            src={additionalImages[currentImageIndex]}
                            alt={`${post.title} - Image ${currentImageIndex + 1}`}
                            className={styles.carouselImage}
                          />
                        </>
                      )}
                      {!direction && (
                        <img
                          src={additionalImages[currentImageIndex]}
                          alt={`${post.title} - Image ${currentImageIndex + 1}`}
                          className={styles.carouselImage}
                        />
                      )}
                    </div>
                    
                    {additionalImages.length > 1 && (
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
                          {additionalImages.map((_, index) => (
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
              </div>
            )}

            {/* Description */}
            <div className={styles.description}>
              <h2>Description</h2>
              <p>{post.description}</p>
            </div>
          </div>
        </article>
      </main>
    </Layout>
  );
}
