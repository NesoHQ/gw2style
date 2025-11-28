-- +migrate Up
CREATE TABLE IF NOT EXISTS 
    moderation_log (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        action VARCHAR(50) NOT NULL,
        moderator_username VARCHAR(255) NOT NULL,
        moderator_discord_id VARCHAR(255),
        reason TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_moderation_log_post_id ON moderation_log(post_id);
CREATE INDEX IF NOT EXISTS idx_moderation_log_created_at ON moderation_log(created_at DESC);
