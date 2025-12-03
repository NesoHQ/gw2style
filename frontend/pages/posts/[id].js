import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '@components/Layout';
import EquipmentDisplay from '@components/EquipmentDisplay';
import styles from '../../styles/Post.module.css';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('');

  // Fetch post data from backend
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/v1/posts/${id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch post');
        }

        setPost(data.data || data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <Head>
          <title>Loading... - GW2Style</title>
        </Head>
        <main className={styles.main}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Loading post...</h2>
          </div>
        </main>
      </Layout>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <Layout>
        <Head>
          <title>Post not found - GW2Style</title>
        </Head>
        <main className={styles.main}>
          <h1>Post not found</h1>
          {error && <p>{error}</p>}
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
