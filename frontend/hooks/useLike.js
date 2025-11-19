/**
 * useLike Hook
 * 
 * Custom hook for managing like/unlike functionality
 * Provides state management and handlers for like operations
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import { isPostLiked, likePost, unlikePost } from '../utils/likes';

export function useLike(postId, initialLikesCount = 0) {
  const { user } = useUser();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if post is liked on mount and when user changes
  useEffect(() => {
    if (user) {
      setIsLiked(isPostLiked(postId));
    } else {
      setIsLiked(false);
    }
  }, [postId, user]);

  const toggleLike = async () => {
    // Require login
    if (!user) {
      router.push('/login');
      return;
    }

    // Prevent double-clicks
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    
    const previousLiked = isLiked;
    const previousCount = likesCount;

    try {
      if (isLiked) {
        // Unlike
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        
        const result = await unlikePost(postId);
        setLikesCount(result.likes_count);
      } else {
        // Like
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        
        const result = await likePost(postId);
        setLikesCount(result.likes_count);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      
      // Rollback on error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      setError(err.message || 'Failed to update like');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLiked,
    likesCount,
    isLoading,
    error,
    toggleLike,
    canLike: !!user,
  };
}
