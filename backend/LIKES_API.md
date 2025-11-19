# Likes API Documentation

## Overview
The likes feature allows authenticated users to like and unlike posts. Each user can only like a post once, and the system tracks the total number of likes for each post.

## Architecture Design

### Two-Table Approach (No Separate Likes Table)

**Posts Table:**
- `likes_count` (INT) - Source of truth for total likes
- Updated atomically on every like/unlike
- Fast reads for displaying like counts

**Users Table:**
- `liked_posts` (JSON array) - List of post IDs user has liked
- Used to prevent double-likes
- Enables quick "is this post liked?" checks
- Synced to frontend localStorage for instant UI updates

### Why This Design?
✅ **Performance:** No JOIN queries needed  
✅ **Scalability:** O(1) reads for like counts  
✅ **Simplicity:** Only 2 tables instead of 3  
✅ **UX:** Frontend can cache liked_posts for instant feedback  

## Database Schema

### Posts Table
```sql
likes_count INT DEFAULT 0
```

### Users Table
```sql
liked_posts JSON DEFAULT '[]'::json
```

**Example liked_posts:**
```json
["123", "456", "789"]
```

## API Endpoints

### 1. Like a Post
**Endpoint:** `POST /api/v1/posts/{id}/like`

**Authentication:** Required (JWT token in cookie)

**Description:** Adds a like to the specified post by the authenticated user.

**Response:**
```json
{
  "success": true,
  "message": "post liked successfully",
  "likes_count": 42,
  "liked": true
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - Post not found
- `409 Conflict` - User already liked this post

---

### 2. Unlike a Post
**Endpoint:** `DELETE /api/v1/posts/{id}/like`

**Authentication:** Required (JWT token in cookie)

**Description:** Removes a like from the specified post by the authenticated user.

**Response:**
```json
{
  "success": true,
  "message": "post unliked successfully",
  "likes_count": 41,
  "liked": false
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - Post not found or like not found

---

### 3. Get User's Liked Posts
**Endpoint:** `GET /api/v1/user/liked-posts`

**Authentication:** Required (JWT token in cookie)

**Description:** Returns all post IDs that the authenticated user has liked. Used for syncing with frontend localStorage.

**Response:**
```json
{
  "success": true,
  "liked_posts": ["123", "456", "789"]
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated

---

### 4. Get Like Status
**Endpoint:** `GET /api/v1/posts/{id}/like`

**Authentication:** Required (JWT token in cookie)

**Description:** Returns whether the authenticated user has liked the post and the total likes count.

**Response:**
```json
{
  "success": true,
  "liked": true,
  "likes_count": 42
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - Post not found

## Implementation Details

### Repository Layer (`repo/likes.go`)
- `LikePost(ctx, postID, userID)` - Adds post ID to user's liked_posts array + increments posts.likes_count
- `UnlikePost(ctx, postID, userID)` - Removes post ID from user's liked_posts array + decrements posts.likes_count
- `HasUserLikedPost(ctx, postID, userID)` - Checks if post ID exists in user's liked_posts array
- `GetPostLikesCount(ctx, postID)` - Gets likes_count directly from posts table

### Handler Layer (`rest/handlers/likes.go`)
- `LikePost` - HTTP handler for liking posts
- `UnlikePost` - HTTP handler for unliking posts
- `GetLikeStatus` - HTTP handler for checking like status
- `GetUserLikedPosts` - HTTP handler for fetching user's liked posts array

### Features
- **Transaction Safety:** All like/unlike operations use database transactions
- **Duplicate Prevention:** JSON array check prevents duplicate likes
- **Atomic Updates:** Both posts.likes_count and users.liked_posts updated in single transaction
- **No JOINs:** All queries are simple, fast lookups
- **Frontend Caching:** liked_posts array syncs to localStorage for instant UI

## Setup Instructions

1. **Run the migration (if needed):**
   ```bash
   psql -U your_user -d your_database -f backend/db/migrations/001_create_likes_table.sql
   ```
   
   Note: If your schema already has `likes_count` in posts and `liked_posts` in users, you're good to go!

2. **Restart the backend server:**
   ```bash
   cd backend
   go run main.go
   ```

## Frontend Integration Flow

1. **On Login:**
   ```javascript
   // Fetch user's liked posts and store in localStorage
   const response = await fetch('/api/v1/user/liked-posts');
   const { liked_posts } = await response.json();
   localStorage.setItem('liked_posts', JSON.stringify(liked_posts));
   ```

2. **On Browse:**
   ```javascript
   // Check if post is liked (instant, no API call)
   const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
   const isLiked = likedPosts.includes(postId);
   ```

3. **On Like/Unlike:**
   ```javascript
   // Optimistic UI update
   const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
   likedPosts.push(postId); // or remove for unlike
   localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
   
   // Then call API
   await fetch(`/api/v1/posts/${postId}/like`, { method: 'POST' });
   ```

## Testing

### Example cURL Commands

**Like a post:**
```bash
curl -X POST http://localhost:8080/api/v1/posts/123/like \
  -H "Cookie: jwt=your_jwt_token"
```

**Unlike a post:**
```bash
curl -X DELETE http://localhost:8080/api/v1/posts/123/like \
  -H "Cookie: jwt=your_jwt_token"
```

**Check like status:**
```bash
curl -X GET http://localhost:8080/api/v1/posts/123/like \
  -H "Cookie: jwt=your_jwt_token"
```

**Get user's liked posts:**
```bash
curl -X GET http://localhost:8080/api/v1/user/liked-posts \
  -H "Cookie: jwt=your_jwt_token"
```

## Notes
- Users must be authenticated to like/unlike posts
- Each user can only like a post once
- Unliking a post that hasn't been liked returns a 404 error
- The `likes_count` field in the posts table is the source of truth
- The `liked_posts` array in users table is for duplicate prevention and UI sync
- Frontend should cache `liked_posts` in localStorage for instant feedback
- Maximum ~10,000 likes per user (not a concern for 10 years based on your estimate)
