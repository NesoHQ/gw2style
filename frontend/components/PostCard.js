import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useLike } from '../hooks/useLike';

export default function PostCard({ post, style }) {
  const { isLiked, likesCount, isLoading, toggleLike, canLike } = useLike(
    post.id,
    post.likes_count || 0
  );

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike();
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  };

  return (
    <Link href={`/posts/${post.id}`} className={styles.card} style={style}>
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
                className={`${styles.likeButton} ${isLiked ? styles.liked : ''} ${isLoading ? styles.loading : ''}`}
                onClick={handleLike}
                disabled={isLoading}
                aria-label={isLiked ? 'Unlike' : 'Like'}
                title={canLike ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
              >
                {isLoading ? '⏳' : '❤️'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
