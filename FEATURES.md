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
- [Reporting & Moderation](#feature-reporting--moderation)
- [Leaderboard](#feature-leaderboard-by-likes)
- [Search Bar & Advanced Filters](#feature-search-bar--advanced-filters)
- [Admin Dashboard](#feature-admin-dashboard-for-moderation--stats)

---

## Feature: User Authentication via Guild Wars 2 API Key

**Status:** 📅 Planned (v0.1)

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
3. Create/fetch user by `account.id`
4. Generate JWT with `{ user_id, username }`
5. Return `{ user, token }` (never store API key)
Middleware validates the token and sets the authenticated user context.
- **Frontend:** HTTP ony cookie for jwt and user info
- **External API:** Guild Wars 2 official API (`/v2/account`)
- **Security:** No passwords or the api key stored server-side

### Acceptance Criteria

- [✅] Valid API keys create user and return JWT
- [✅] Invalid keys show error message

### Roadmap

- **Next Steps:**
  - Frontend validation for key scope before submission
  - Server-side caching of verified usernames

### Contributing

Help wanted:
- UI feedback improvements for failed login attempts
- Type-safe TypeScript interfaces for GW2 API responses

---

## Feature: Post Creation and Display System

**Status:** 📅 Planned (v0.1)

### Problem Solved

GW2 players lack a unified platform for sharing fashion screenshots. Content is fragmented across Discord and Reddit, making discovery difficult.

### Solution Overview

Provides a comprehensive post creation form with fields for title, description, armor details, weapons, cosmetics, tags, and image links. All posts display in a public gallery accessible to everyone.

### User Flow

1. User authenticates via GW2 API key
2. Opens Create Post page
3. Fills in outfit details, tags, and image URLs
4. Submits form → backend validates and stores post
5. Post appears immediately on homepage

### Technical Implementation

- **Backend:** Go REST API (`/posts/create`, `/posts/all`, `/posts/:id`)
- **Database:** PostgreSQL `posts` table with comprehensive columns
- **Frontend:** Form validation and gallery display components
- **Images:** External hosting (Imgur, Google Drive, etc.)
- **Pagination:** Optimized queries for infinite scrolling

### Acceptance Criteria

- [ ] Valid posts save successfully and appear in feed
- [ ] Invalid/incomplete data rejected with clear error messages
- [ ] Homepage displays posts in newest-first order

### Roadmap

- **Next Steps:**
  - Post editing functionality
  - Draft/preview system before publishing

### Contributing

Help wanted:
- Enhanced form validation
- UI/UX polish and accessibility improvements

---

## Feature: Homepage Feed (Latest Posts with Pagination)

**Status:** 📅 Planned (v0.1)

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

- [ ] Posts load in correct chronological order (newest → oldest)
- [ ] Pagination works smoothly without duplicates
- [ ] Loading indicators display during fetch operations

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

**Status:** 📅 Planned (v0.2)

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

- [ ] Tag filters return accurate matching posts
- [ ] Multiple tags can be combined (AND/OR logic)
- [ ] Clearing filters resets to full feed
- [ ] Filter state persists during session

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

**Status:** 📅 Planned (v0.2)

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

- [ ] Likes persist per user across sessions
- [ ] Each user can like/unlike once per post
- [ ] Like count updates in real-time
- [ ] Unlike functionality available

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

**Status:** 📅 Planned (v0.2)

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

- [ ] Users can only delete their own posts
- [ ] Deleted posts disappear from public feed immediately
- [ ] Confirmation dialog prevents accidental deletion

### Roadmap

- **Next Steps:**
  - Undo feature (restore within 24 hours)
  - Deletion history in user profile

### Contributing

Help wanted:
- Soft delete implementation
- Audit log system

---

## Feature: Reporting & Moderation

**Status:** 📅 Planned (v0.2)

### Problem Solved

Platform needs community-driven content moderation to handle inappropriate posts.

### Solution Overview

User reporting system with admin review queue for handling flags.

### User Flow

1. User clicks "Report" button on problematic post
2. Selects reason (NSFW, spam, off-topic, etc.)
3. Report stored in database
4. Admins review reports via dashboard

### Technical Implementation

- **Backend:** Report submission and admin review endpoints
- **Database:** `reports` table tracking `post_id`, `reporter`, `reason`, `status`
- **Rate Limiting:** Prevents report spam
- **Admin Tools:** Dashboard for report queue management

### Acceptance Criteria

- [ ] Reports logged with complete metadata
- [ ] Rate limiting prevents abuse
- [ ] Admins can resolve or dismiss reports
- [ ] Resolved reports archived for transparency

### Roadmap

- **Current:** Planned for v0.2
- **Next Steps:**
  - Email/Discord notifications for admins
  - Automated flagging for repeated offenders

### Contributing

Help wanted:
- Moderation UI design
- Report filtering and sorting logic
- Admin notification system

---

## Feature: Leaderboard (by Likes)

**Status:** 📅 Planned (v0.3)

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

- [ ] Leaderboard updates periodically (hourly)
- [ ] Accurate like counts reflected
- [ ] Multiple timeframe options available
- [ ] Mobile-responsive layout

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

## Feature: Search Bar & Advanced Filters

**Status:** 📅 Planned (v0.3+)

### Problem Solved

Users need powerful search capabilities beyond basic tag filtering.

### Solution Overview

Full-text search supporting keywords across titles, descriptions, and tags with real-time results.

### User Flow

1. User types query (e.g., "human light armor red")
2. Backend parses and searches across relevant fields
3. Results display dynamically in gallery
4. Search history saved for quick access

### Technical Implementation

- **Backend:** PostgreSQL full-text search with ranking
- **Database:** GIN index on searchable text fields
- **Frontend:** Debounced search with autocomplete suggestions
- **Performance:** Sub-200ms response time for common queries

### Acceptance Criteria

- [ ] Search returns relevant results by keyword or tag
- [ ] Performance under 200ms for 95th percentile
- [ ] Search suggestions based on popular queries
- [ ] Typo tolerance and fuzzy matching

### Roadmap

- **Current:** Future feature (v0.3+)
- **Next Steps:**
  - Search history and saved searches
  - Advanced filters (date range, creator)

### Contributing

Help wanted:
- PostgreSQL full-text search optimization
- Search UI/UX design
- Autocomplete implementation

---

## Feature: Admin Dashboard (for Moderation & Stats)

**Status:** 📅 Planned (v0.4+)

### Problem Solved

Moderators need centralized tools to manage content, review reports, and monitor platform health.

### Solution Overview

Secure admin-only dashboard providing moderation tools, analytics, and content management.

### User Flow

1. Admin authenticates with secure credentials
2. Accesses dashboard at `/admin`
3. Reviews reports, views statistics, manages users
4. Takes moderation actions (delete, warn, resolve)
5. All actions logged for transparency

### Technical Implementation

- **Backend:** Protected admin endpoints with role-based access
- **Frontend:** Dedicated admin interface with data visualization
- **Database:** Analytics queries and audit logging
- **Security:** Restricted to verified admin accounts

### Acceptance Criteria

- [ ] Admins can view and action all reports
- [ ] Dashboard displays accurate metrics (posts, users, engagement)
- [ ] Unauthorized users cannot access admin routes
- [ ] All admin actions logged to audit trail

### Roadmap

- **Current:** Planned for v0.4+
- **Next Steps:**
  - User management tools
  - Analytics charts and graphs
  - Bulk moderation actions

### Contributing

Help wanted:
- Data visualization components (charts, graphs)
- Admin route security hardening
- Audit log interface design

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