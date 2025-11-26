# Discord Moderation System Setup

## 1. Database Setup

Run these SQL commands in your PostgreSQL database:

```sql
-- Add published column to posts table (if not exists)
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- Create reports table for user-submitted reports
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    reporter_username VARCHAR(255) NOT NULL,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('nsfw', 'spam', 'off-topic', 'harassment', 'other')),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(255)
);

-- Create moderation_log table for audit trail
CREATE TABLE IF NOT EXISTS moderation_log (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL CHECK (action IN ('published', 'rejected', 'deleted')),
    moderator_username VARCHAR(255) NOT NULL,
    moderator_discord_id VARCHAR(255),
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_post_id ON reports(post_id);
CREATE INDEX IF NOT EXISTS idx_moderation_log_post_id ON moderation_log(post_id);
CREATE INDEX IF NOT EXISTS idx_moderation_log_created_at ON moderation_log(created_at DESC);
```

## 2. Environment Variables

Update your `backend/.env` file with your Discord credentials:

```env
DISCORD_BOT_TOKEN=your_actual_bot_token_here
DISCORD_WEBHOOK_URL=your_webhook_url_here
DISCORD_MOD_CHANNEL_ID=your_channel_id_here
```

## 3. API Endpoints Created

### Admin Endpoints (Bot-Authenticated)

**Publish Post:**
```
POST /api/v1/admin/posts/{id}/publish
Authorization: Bot YOUR_BOT_TOKEN

Body:
{
  "moderator_username": "ModeratorName",
  "moderator_discord_id": "123456789"
}
```

**Reject Post:**
```
POST /api/v1/admin/posts/{id}/reject
Authorization: Bot YOUR_BOT_TOKEN

Body:
{
  "moderator_username": "ModeratorName",
  "moderator_discord_id": "123456789",
  "reason": "Does not meet guidelines"
}
```

### User Endpoints (JWT-Authenticated)

**Report Post:**
```
POST /api/v1/posts/{id}/report
Authorization: Bearer JWT_TOKEN

Body:
{
  "reason": "spam",
  "description": "This post is spam"
}

Valid reasons: "nsfw", "spam", "off-topic", "harassment", "other"
```

## 4. How It Works

1. **User creates a post** → Post is saved with `published = false`
2. **Backend sends webhook to Discord** → Notification appears in #mod-review channel
3. **Discord bot monitors reactions** → Moderators react with ✅ or ❌
4. **Bot calls backend API** → Post is published or rejected
5. **Action is logged** → All moderation actions stored in `moderation_log` table

## 5. Testing

### Test Post Creation:
```bash
curl -X POST http://localhost:8080/api/v1/posts/create \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "description": "Testing moderation",
    "thumbnailUrl": "https://example.com/image.jpg",
    "equipments": {},
    "tags": ["test"],
    "published": false
  }'
```

### Test Publish (from bot):
```bash
curl -X POST http://localhost:8080/api/v1/admin/posts/1/publish \
  -H "Authorization: Bot YOUR_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "moderator_username": "TestMod",
    "moderator_discord_id": "123456789"
  }'
```

### Test Reject (from bot):
```bash
curl -X POST http://localhost:8080/api/v1/admin/posts/1/reject \
  -H "Authorization: Bot YOUR_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "moderator_username": "TestMod",
    "moderator_discord_id": "123456789",
    "reason": "Test rejection"
  }'
```

## 6. Next Steps

1. Run the SQL commands above
2. Update your `.env` file with Discord credentials
3. Restart your backend server
4. Implement the Discord bot to:
   - Listen for webhooks
   - Monitor emoji reactions
   - Call the backend API endpoints
5. Test the full workflow

## 7. Files Created/Modified

**New Files:**
- `backend/rest/middlewares/bot_auth.go` - Bot authentication middleware
- `backend/repo/moderation.go` - Moderation repository
- `backend/rest/handlers/admin.go` - Admin endpoints
- `backend/rest/handlers/webhook.go` - Discord webhook helper
- `backend/rest/handlers/reports.go` - User reporting endpoint
- `backend/db/migrations/002_add_moderation_tables.sql` - SQL migration

**Modified Files:**
- `backend/.env` - Added Discord config
- `backend/config/config.go` - Added Discord config fields
- `backend/rest/handlers/handler.go` - Added moderation repo
- `backend/rest/handlers/create_post.go` - Added Discord notification
- `backend/rest/routes.go` - Added new routes
