-- Migration: Replace tag_id with tags JSONB array
-- This migration updates the posts table to use JSONB tags instead of tag_id

-- Add the new tags column
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Drop the old tag_id column (if you want to keep existing data, skip this step)
ALTER TABLE posts DROP COLUMN IF EXISTS tag_id;

-- Create GIN index for efficient tag filtering
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN (tags);

-- Create index for published posts with tags (common query pattern)
CREATE INDEX IF NOT EXISTS idx_posts_published_tags ON posts USING GIN (tags) WHERE published = true;

-- Optional: If you want to migrate existing tag_id data to tags array
-- Uncomment and modify based on your tag mapping
-- UPDATE posts SET tags = jsonb_build_array('YourTagName') WHERE tag_id = 1;
