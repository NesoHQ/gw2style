-- Migration for likes feature
-- No separate likes table needed - using posts.likes_count and users.liked_posts

-- Ensure posts table has likes_count column (should already exist from schema)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'posts' AND column_name = 'likes_count'
    ) THEN
        ALTER TABLE posts ADD COLUMN likes_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Ensure users table has liked_posts column (should already exist from schema)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'liked_posts'
    ) THEN
        ALTER TABLE users ADD COLUMN liked_posts JSON DEFAULT '[]'::json;
    END IF;
END $$;

-- Create index on posts.likes_count for sorting popular posts
CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON posts(likes_count DESC);

-- Create GIN index on users.liked_posts for fast array lookups
CREATE INDEX IF NOT EXISTS idx_users_liked_posts ON users USING GIN ((liked_posts::jsonb));
