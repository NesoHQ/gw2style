# Frontend Likes Feature Documentation

## Overview
The likes feature allows logged-in users to like and unlike posts with instant UI feedback using localStorage caching.

## Architecture

### Flow Diagram
```
User Login → Fetch liked_posts from backend → Save to localStorage
User Clicks Like → Optimistic UI update → API call → Update localStorage
User Browses Posts → Read from localStorage → Instant "liked" highlight
```

## Files Created/Modified

### New Files
1. **`utils/likes.js`** - Core like functionality
   - `getLikedPostsFromCache()` - Read from localStorage
   - `isPostLiked(postId)` - Check if post is liked
   - `likePost(postId)` - Like a post (API + cache)
   - `unlikePost(postId)` - Unlike a post (API + cache)
   - `syncLikedPostsFromBackend()` - Sync from backend on login

2. **`pages/api/posts/[id]/like.js`** - API proxy for like/unlike
3. **`pages/api/user/liked-posts.js`** - API proxy for fetching liked posts

### Modified Files
1. **`context/UserContext.js`**
   - Added `syncLikedPostsFromBackend()` on login
   - Added `clearLikedCache()` on logout

2. **`components/PostCard.js`**
   - Added real like/unlike functionality
   - Added loading state
   - Added login requirement check
   - Added optimistic UI updates with rollback

3. **`styles/Home.module.css`**
   - Added `.loading` state for like button
   - Added `:disabled` state styling

## Features

### ✅ Instant UI Feedback
- Reads from localStorage for immediate "liked" state
- No loading spinner when browsing posts
- Optimistic updates when clicking like/unlike

### ✅ Backend Validation
- All likes verified by backend
- Prevents double-likes
- Rollback on API errors

### ✅ Login Required
- Redirects to `/login` if not authenticated
- Shows "Login to like" tooltip for logged-out users

### ✅ Error Handling
- Rollback UI on API failure
- Shows error alert to user
- Maintains data consistency

### ✅ Loading States
- Shows ⏳ emoji during API call
- Disables button to prevent double-clicks
- Smooth animations

## Usage

### In PostCard Component
```javascript
import { useUser } from '../context/UserContext';
import { isPostLiked, likePost, unlikePost } from '../utils/likes';

const { user } = useUser();
const [isLiked, setIsLiked] = useState(isPostLiked(post.id));

const handleLike = async () => {
  if (!user) {
    router.push('/login');
    return;
  }
  
  if (isLiked) {
    await unlikePost(post.id);
  } else {
    await likePost(post.id);
  }
};
```

### Checking if Post is Liked
```javascript
import { isPostLiked } from '../utils/likes';

const liked = isPostLiked(postId); // Returns boolean
```

### Manual Sync (if needed)
```javascript
import { syncLikedPostsFromBackend } from '../utils/likes';

await syncLikedPostsFromBackend(); // Fetches from backend and updates cache
```

## localStorage Structure

**Key:** `gw2_liked_posts`

**Value:** JSON array of post IDs
```json
["123", "456", "789"]
```

## API Endpoints Used

### Like a Post
```
POST /api/posts/{id}/like
```

### Unlike a Post
```
DELETE /api/posts/{id}/like
```

### Get User's Liked Posts
```
GET /api/user/liked-posts
```

## Testing

### Test Like Functionality
1. Login to the application
2. Browse posts - liked posts should show red heart
3. Click heart on unliked post - should turn red immediately
4. Refresh page - heart should still be red
5. Click heart again - should turn gray immediately
6. Logout - all hearts should turn gray

### Test Without Login
1. Logout or open in incognito
2. Click heart on any post
3. Should redirect to `/login` page

### Test Error Handling
1. Turn off backend server
2. Try to like a post
3. Should show error alert
4. Heart should rollback to previous state

## Performance

- **Initial Load:** ~0ms (reads from localStorage)
- **Like/Unlike:** ~100-300ms (API call)
- **Sync on Login:** ~200-500ms (one-time fetch)

## Browser Compatibility

- ✅ Chrome/Edge (localStorage supported)
- ✅ Firefox (localStorage supported)
- ✅ Safari (localStorage supported)
- ⚠️ Private/Incognito mode (localStorage may be cleared on close)

## Future Enhancements

- [ ] Add like animation (heart burst effect)
- [ ] Show "You and X others" on hover
- [ ] Add unlike confirmation for accidental clicks
- [ ] Batch sync for offline likes
- [ ] Real-time like count updates (WebSocket)
