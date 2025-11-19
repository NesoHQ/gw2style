/**
 * Likes Utility Functions
 * 
 * Manages like/unlike operations with localStorage caching for instant UI updates
 */

const LIKED_POSTS_KEY = 'gw2_liked_posts';

/**
 * Get liked posts from localStorage
 * @returns {string[]} Array of post IDs
 */
export function getLikedPostsFromCache() {
  if (typeof window === 'undefined') return [];
  
  try {
    const cached = localStorage.getItem(LIKED_POSTS_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error('Error reading liked posts from cache:', error);
    return [];
  }
}

/**
 * Save liked posts to localStorage
 * @param {string[]} likedPosts - Array of post IDs
 */
export function saveLikedPostsToCache(likedPosts) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(likedPosts));
  } catch (error) {
    console.error('Error saving liked posts to cache:', error);
  }
}

/**
 * Check if a post is liked
 * @param {string} postId - Post ID to check
 * @returns {boolean} True if post is liked
 */
export function isPostLiked(postId) {
  const likedPosts = getLikedPostsFromCache();
  return likedPosts.includes(String(postId));
}

/**
 * Add a post to liked posts cache
 * @param {string} postId - Post ID to add
 */
export function addToLikedCache(postId) {
  const likedPosts = getLikedPostsFromCache();
  if (!likedPosts.includes(String(postId))) {
    likedPosts.push(String(postId));
    saveLikedPostsToCache(likedPosts);
  }
}

/**
 * Remove a post from liked posts cache
 * @param {string} postId - Post ID to remove
 */
export function removeFromLikedCache(postId) {
  const likedPosts = getLikedPostsFromCache();
  const filtered = likedPosts.filter(id => id !== String(postId));
  saveLikedPostsToCache(filtered);
}

/**
 * Clear all liked posts from cache
 */
export function clearLikedCache() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LIKED_POSTS_KEY);
}

/**
 * Fetch user's liked posts from backend and sync to localStorage
 * @returns {Promise<string[]>} Array of liked post IDs
 */
export async function syncLikedPostsFromBackend() {
  try {
    const response = await fetch('/api/user/liked-posts', {
      credentials: 'include', // Include cookies for JWT
    });

    if (!response.ok) {
      throw new Error('Failed to fetch liked posts');
    }

    const data = await response.json();
    
    if (data.success && data.liked_posts) {
      const likedPosts = Array.isArray(data.liked_posts) 
        ? data.liked_posts 
        : [];
      
      saveLikedPostsToCache(likedPosts);
      return likedPosts;
    }

    return [];
  } catch (error) {
    console.error('Error syncing liked posts:', error);
    return getLikedPostsFromCache(); // Fallback to cache
  }
}

/**
 * Like a post (API call + cache update)
 * @param {string} postId - Post ID to like
 * @returns {Promise<{success: boolean, likes_count: number}>}
 */
export async function likePost(postId) {
  try {
    // Optimistic update
    addToLikedCache(postId);

    const response = await fetch(`/api/posts/${postId}/like`, {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      // Rollback on error
      removeFromLikedCache(postId);
      throw new Error(data.error || 'Failed to like post');
    }

    return {
      success: true,
      likes_count: data.likes_count,
    };
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
}

/**
 * Unlike a post (API call + cache update)
 * @param {string} postId - Post ID to unlike
 * @returns {Promise<{success: boolean, likes_count: number}>}
 */
export async function unlikePost(postId) {
  try {
    // Optimistic update
    removeFromLikedCache(postId);

    const response = await fetch(`/api/posts/${postId}/like`, {
      method: 'DELETE',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      // Rollback on error
      addToLikedCache(postId);
      throw new Error(data.error || 'Failed to unlike post');
    }

    return {
      success: true,
      likes_count: data.likes_count,
    };
  } catch (error) {
    console.error('Error unliking post:', error);
    throw error;
  }
}
