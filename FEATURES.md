# 🧩 GW2STYLE — Feature Documentation

This document outlines all features in GW2STYLE, including implementation details, status, and contribution opportunities.

---

## 📋 Table of Contents

- [User Authentication via GW2 API Key](#feature-user-authentication-via-guild-wars-2-api-key)
- [Post Creation and Display System](#feature-post-creation-and-display-system)
- [Homepage Feed with Pagination](#feature-homepage-feed-latest-posts-with-pagination)
- [Tag Search & Filtering](#feature-tag-search--filtering)
- [Likes / Reactions System](#feature-likes--reactions-system)
- [Post Deletion](#feature-post-deletion)
- [Leaderboard](#feature-leaderboard-by-likes)
- [Discord-Based Moderation System](#feature-discord-based-moderation-system)
- [Discord Bot Analytics & Commands](#feature-discord-bot-analytics--commands)

---

## Feature: User Authentication via Guild Wars 2 API Key

**Status:** ✅ Implemented (v0.1)

### Problem Solved

Traditional account systems add friction and maintenance overhead. By leveraging the official Guild Wars 2 API, players authenticate instantly without passwords or signin.

### Solution Overview

Players authenticate using their GW2 API key. The backend validates it via the official `/v2/account` endpoint, and the player's account ID & name is stored in DB & browser(JWT).

### User Flow

1. Player navigates to the Login page
2. Enters their GW2 API key (requires `account`. `characters`, `builds` scope) `https://wiki.guildwars2.com/images/d/dd/API_Key_Creation.png`
3. Backend validates the key against `https://api.guildwars2.com/v2/account`
4. On success, userid and name is stored in DB and JWT in Clint's browser
5. user can now create, edit their own posts
6. Logout clears the stored credentials from there browser

### Technical Implementation

- **Backend:** Go endpoint `/login` validates keys and returns `{ username, jwt }`

1. Validate GW2 API key via `/v2/tokeninfo` (requires `account`, `characters`, `builds` scopes)
2. Fetch account data from `/v2/account`
3. Create/fetch user by `account.id`, storing API key securely
4. Generate JWT with `{ user_id, username }`
5. Return `{ user, token }`
   Middleware validates the token and sets the authenticated user context.

- **Frontend:** HTTP only cookie for jwt and user info
- **External API:** Guild Wars 2 official API (`/v2/account`)
- **Security:**
  - API keys stored securely in database with UNIQUE constraint
  - JWT for session management
  - API key enables automatic user verification and data fetching

### Acceptance Criteria

- [✅] Valid API keys create user and return JWT
- [✅] Invalid keys show error message

### Roadmap

- **Next Steps:**
  - Server-side token caching for verified users

### Contributing

Help wanted:

- UI feedback improvements for failed login attempts

---

## Feature: Post Creation and Display System

**Status:** ✅ Implemented (v0.1)

### Problem Solved

GW2 players lack a unified platform for sharing fashion screenshots. Content is fragmented across Discord and Reddit, making discovery difficult.

### Solution Overview

Provides a comprehensive post creation form with fields for title, description, armor details, weapons, cosmetics, and image links. Posts are displayed in both a masonry grid gallery and detailed individual views.

### User Flow

1. User authenticates via GW2 API key
2. Opens Create Post page
3. Fills in outfit details and uploads up to 5 images
4. Submits form → backend validates and stores post
5. Post appears after validations on homepage
6. Users can click to view detailed post page with:
   - Image gallery with thumbnails
   - Full equipment details
   - View counter
   - Like system

### Technical Implementation

- **Backend:**

  - Go REST API endpoints:
    - `/posts/create` for new posts
    - `/posts` for listing/search
    - `/posts/:id` for individual posts
  - Automatic view counting
  - JWT authentication
  - Equipment JSON storage

- **Database:**

  - PostgreSQL `posts` table with columns:
    - Basic info (title, description)
    - Multiple image URLs
    - Equipment JSON data
    - Metadata (views, likes, created_at)

- **Frontend:**
  - Responsive masonry grid layout
  - Image gallery with thumbnail navigation
  - Form validation and error handling
  - Optimized image loading

### Acceptance Criteria

- [✅] Valid posts save successfully and appear in feed
- [✅] Invalid/incomplete data rejected with clear error messages
- [✅] Homepage displays posts in newest-first order
- [✅] Individual post pages show all details
- [✅] Like counting works correctly
- [✅] Images display in gallery format

### Roadmap

- **Next Steps:**
  - Image upload instead of links

### Contributing

Help wanted:
- Help on Individual post pages show all details(How it should look like)
- Performance optimizations for large galleries
- Accessibility enhancements

---

## Feature: Homepage Feed (Latest Posts with Pagination)

**Status:**  ✅ Implemented (v0.1)

### Problem Solved

Users need an effortless way to discover the most recent outfits without manual navigation.

### Solution Overview

Displays latest posts with infinite scrolling. Posts load dynamically as users scroll, providing a smooth browsing experience.

### User Flow

1. User visits homepage
2. Frontend fetches initial posts from `/posts?page=1`
3. Intersection observer detects scroll position
4. Additional posts load automatically as user scrolls down

### Technical Implementation

- **Backend:** Pagination via query parameters (`limit`, `offset`)
- **Database:** Indexed by `created_at` for fast sorting
- **Frontend:** Intersection Observer API for scroll detection
- **Performance:** Optimized queries prevent duplicate loading

### Acceptance Criteria

- [✅] Posts load in correct chronological order (newest → oldest)
- [✅] Pagination works smoothly without duplicates
- [✅] Loading indicators display during fetch operations

### Roadmap

- **Next Steps:**
  - Implement caching layer for faster repeat visits
  - Add "Back to Top" button for long scrolls

### Contributing

Help wanted:

- Scroll performance optimization
- Loading state UI improvements

---

## Feature: Tag Search & Filtering

**Status:**  ✅ Implemented (v0.2)

### Problem Solved

Without filtering, players cannot efficiently find specific styles, armor types, or themes.

### Solution Overview

Tag-based filtering system allowing users to discover posts by categories like "Light Armor," "Sylvari," "Casual," etc.

### User Flow

1. User selects one or more tags from filter panel
2. Frontend requests `/posts?tags=tag1,tag2`
3. Backend returns filtered posts sorted by date
4. User can combine multiple tags or clear filters

### Technical Implementation

- **Backend:** PostgreSQL array filtering on `tags` column
- **Database:** GIN index on tags for fast queries
- **Frontend:** Interactive tag buttons with active state display
- **Performance:** Optimized for thousands of posts

### Acceptance Criteria

- [✅] Tag filters return accurate matching posts
- [✅] Multiple tags can be combined
- [✅] Clearing filters resets to full feed

### Roadmap

- **Current:** Planned for post-MVP (v0.2)
- **Next Steps:**
  - User-suggested custom tags
  - Popular tags display

### Contributing

Help wanted:

- Tag UI component design
- Backend indexing optimization
- Tag autocomplete functionality

---

## Feature: Likes / Reactions System

**Status:** ✅ Implemented

### Problem Solved

Users need a quick way to show appreciation for outfits without leaving comments.

### Solution Overview

Simple like/reaction system tracking engagement per post with one like per user.

### User Flow

1. User clicks ❤️ icon on a post
2. Frontend sends request to `/posts/:id/like`
3. Backend increments counter and prevents duplicates
4. Updated count displays immediately

### Technical Implementation

- **Backend:** Endpoints for like/unlike actions
- **Database:** `likes` table with `post_id` and `username` (unique constraint)
- **Frontend:** Optimistic UI updates with error rollback
- **Caching:** Like counts cached for performance

### Acceptance Criteria

- [✅] Likes persist per user across sessions
- [✅] Each user can like/unlike any post
- [✅] Like count updates in real-time
- [✅] Unlike functionality available

### Roadmap

- **Current:** Planned for v0.2
- **Next Steps:**
  - Leaderboard integration
  - Reaction types (love, inspired, etc.)

### Contributing

Help wanted:

- Anti-spam/bot prevention
- Like button animations
- Notification system for post creators

---

## Feature: Post Deletion

**Status:** ✅ Implemented

### Problem Solved

Players need control over their own content with ability to remove posts.

### Solution Overview

Authenticated users can delete their own posts with ownership verification.

### User Flow

1. User clicks "Delete" button on their post
2. Confirmation dialog appears
3. Backend verifies ownership via username match
4. Post is removed from database and feed

### Technical Implementation

- **Backend:** `/posts/:id/delete` endpoint with auth check
- **Security:** Username-based ownership verification
- **Database:** Soft delete (flagged as deleted for audit trail)

### Acceptance Criteria

- [✅] Users can only delete their own posts
- [✅] Deleted posts disappear from public feed immediately
- [✅] Confirmation dialog prevents accidental deletion

### Roadmap

- **Next Steps:**
  - Undo feature (restore within 24 hours)
  - Deletion history in user profile

### Contributing

Help wanted:

- Soft delete implementation
- Audit log system

---

## Feature: Discord-Based Moderation System

**Status:** 📅 Planned (v0.2)

### Problem Solved

Platform needs efficient content moderation without the complexity of building a full admin dashboard. Traditional admin panels add development overhead and require moderators to context-switch between platforms.

### Solution Overview

Discord bot integration for post moderation. All posts start as unpublished and require moderator approval via Discord emoji reactions. This keeps moderation lightweight, community-integrated, and requires no additional frontend.

### User Flow

**Post Submission:**
1. User creates post via website
2. Post saved as `published = false` in database
3. Discord bot sends notification to private #mod-review channel with post details
4. Moderators react with ✅ (approve), ❌ (reject), or 📝 (request changes)
5. Bot calls backend API to update post status
6. If approved, bot announces new post in public Discord channel

**User Reporting (Optional):**
1. User clicks "Report" button on problematic post
2. Selects reason (NSFW, spam, off-topic, etc.)
3. Report sent to Discord moderation channel
4. Moderators review and take action via emoji reactions

### Technical Implementation

- **Backend:**
  - `/admin/publish` endpoint (bot-authenticated)
  - `/admin/reject` endpoint (bot-authenticated)
  - Optional `/reports/submit` for user reports
  - Bot token validation middleware
  - Moderator role verification

- **Discord Bot:**
  - Listens for new post webhooks
  - Sends formatted messages to #mod-review
  - Monitors emoji reactions from moderators
  - Calls backend APIs based on reactions
  - Announces approved posts to public channel

- **Database:**
  - `posts` table: `published` boolean field (default: false)
  - Optional `reports` table for user-submitted reports
  - Audit log for moderation actions

- **Security:**
  - Bot-only API endpoints with secure token
  - Discord role verification (only moderators can react)
  - Backend validates bot identity and moderator permissions
  - No admin passwords or session management needed

### Acceptance Criteria

- [ ] New posts trigger Discord notifications
- [ ] Only moderators with specific role can approve/reject
- [ ] Emoji reactions correctly update post status
- [ ] Approved posts appear on website immediately
- [ ] Bot announces published posts to public channel
- [ ] All moderation actions logged for transparency
- [ ] Rate limiting prevents spam submissions

### Roadmap

- **Current:** Planned for v0.2
- **Next Steps:**
  - User reporting integration
  - Automated flagging for repeated violations
  - Moderation statistics dashboard (Discord bot command)
  - Edit request workflow (📝 reaction)

### Contributing

Help wanted:

- Discord bot development (Discord.js or discord.py)
- Webhook integration design
- Moderation workflow testing
- Bot command features

---

## Feature: Leaderboard (by Likes)

**Status:** ✅ Implemented

### Problem Solved

Users want to discover the most popular outfits and recognize top creators.

### Solution Overview

Dynamic leaderboard displaying most-liked posts over various timeframes.

### User Flow

1. User visits Leaderboard page
2. Views top posts sorted by like count
3. Can filter by timeframe (daily, weekly, all-time)
4. Clicks posts to view full details

### Technical Implementation

- **Backend:** Optimized query sorting by `like_count DESC`
- **Database:** Indexed like counts for fast retrieval
- **Caching:** Hourly refresh to reduce database load
- **Frontend:** Podium-style display with creator recognition

### Acceptance Criteria

- [✅] Leaderboard updates
- [✅] Accurate like counts reflected
- [✅] Multiple timeframe options available
- [❌] Mobile-responsive layout

### Roadmap

- **Current:** Planned for v0.3
- **Next Steps:**
  - Category-based leaderboards (race, armor type)
  - Creator leaderboards (most total likes)

### Contributing

Help wanted:

- Leaderboard design and animations
- Caching strategy optimization
- Category filter implementation

---

## Feature: Discord Bot Analytics & Commands

**Status:** 📅 Planned (v0.4+)

### Problem Solved

Moderators need quick access to platform statistics and moderation history without building a complex admin dashboard.

### Solution Overview

Discord bot commands provide on-demand analytics and moderation tools directly in Discord. This eliminates the need for a separate admin dashboard while keeping data accessible to the moderation team.

### User Flow

1. Moderator types bot command in Discord (e.g., `/stats`, `/recent-posts`, `/user-history`)
2. Bot queries backend API
3. Bot responds with formatted statistics or data
4. Moderators can take actions via follow-up commands or reactions

### Technical Implementation

- **Discord Bot Commands:**
  - `/stats` - Platform overview (total posts, users, likes)
  - `/recent-posts` - Last 10 submitted posts with status
  - `/user-posts <username>` - All posts by specific user
  - `/modlog` - Recent moderation actions
  - `/pending` - Count of posts awaiting approval

- **Backend:**
  - Bot-authenticated API endpoints for analytics
  - Aggregation queries for statistics
  - Audit log retrieval endpoints

- **Security:**
  - Commands restricted to moderator role
  - Bot token authentication
  - Rate limiting on analytics queries

### Acceptance Criteria

- [ ] Bot commands return accurate real-time data
- [ ] Only moderators can execute commands
- [ ] Response times under 3 seconds
- [ ] All queries logged for audit trail
- [ ] Commands work in designated channels only

### Roadmap

- **Current:** Planned for v0.4+
- **Next Steps:**
  - User management commands (ban, warn)
  - Bulk moderation actions
  - Automated weekly statistics reports
  - Integration with platform webhooks

### Contributing

Help wanted:

- Discord bot command design
- Data visualization in Discord embeds
- Performance optimization for analytics queries
- Command permission system

---

## 🤝 How to Contribute

Each feature welcomes contributions! To get started:

1. Check the **Status** to see if the feature is implemented or planned
2. Review **Contributing** sections for specific help needed
3. Join our [Discord](https://discord.com/invite/xvArbFbh34) to discuss your ideas

---

**Legend:**

- ✅ Implemented - Feature is live
- 📅 Planned - Feature is designed and awaiting development
- 🚧 In Progress - Feature is actively being built
