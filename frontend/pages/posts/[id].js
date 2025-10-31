import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '@components/Header';
import Footer from '@components/Footer';
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
        post: data,
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
  const [activeImage, setActiveImage] = useState(post?.thumbnail || '');

  if (!post) {
    return (
      <div className="container">
        <Header />
        <main className={styles.main}>
          <h1>Post not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  // Collect all available images
  const images = [post.thumbnail]
    .concat([post.image1, post.image2, post.image3, post.image4, post.image5])
    .filter(Boolean); // Remove null/empty values

  return (
    <div className="container">
      <Head>
        <title>{post.title} - GW2Style</title>
        <meta name="description" content={post.description} />
      </Head>

      <Header />

      <main className={styles.main}>
        <article className={styles.post}>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
              <span className={styles.author}>By {post.author_name}</span>
              <span className={styles.date}>
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className={styles.views}>
                {new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(post.views)}{' '}
                views
              </span>
            </div>
          </header>

          <div className={styles.content}>
            <div className={styles.imageGallery}>
              <div className={styles.mainImage}>
                <Image
                  src={activeImage}
                  alt={post.title}
                  width={800}
                  height={0}
                  style={{ width: '100%', height: 'auto' }}
                  priority
                />
              </div>

              {images.length > 1 && (
                <div className={styles.thumbnails}>
                  {images.map((img, index) => (
                    <button
                      key={index}
                      className={`${styles.thumbnail} ${
                        activeImage === img ? styles.active : ''
                      }`}
                      onClick={() => setActiveImage(img)}
                    >
                      <Image
                        src={img}
                        alt={`View ${index + 1}`}
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.description}>
              <h2>Description</h2>
              <p>{post.description}</p>
            </div>

            {post.equipments && Object.keys(post.equipments).length > 0 && (
              <div className={styles.equipment}>
                <h2>Equipment</h2>
                <pre>{JSON.stringify(post.equipments, null, 2)}</pre>
              </div>
            )}

            <div className={styles.stats}>
              <div className={styles.likes}>
                <span>❤️ {post.likes_count}</span>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
