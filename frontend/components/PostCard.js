import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      setLikesCount(likesCount - 1);
      setIsLiked(false);
    } else {
      setLikesCount(likesCount + 1);
      setIsLiked(true);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  };

  return (
    <Link href={`/posts/${post.id}`} className={styles.card}>
      <div>
        <div className={styles.imageWrapper}>
          <Image
            src={post.thumbnail}
            alt={post.title}
            width={400}
            height={0}
            priority
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
        <div className={styles.info}>
          <h2 className={styles.title}>{post.title}</h2>
          <div className={styles.stats}>
            <p className={styles.authorName}>{post.author_name || 'Anonymous'}</p>
            <div className={styles.likesContainer}>
              <span className={styles.likesCount}>
                {formatNumber(likesCount)}
              </span>
              <button
                className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
                onClick={handleLike}
                aria-label={isLiked ? 'Unlike' : 'Like'}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                ❤️
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
