-- Script to populate random tags for existing posts
-- Each post gets:
-- - 1 random race tag
-- - 1 random gender tag
-- - 1 random armor type tag
-- - 1 random class tag
-- - 0-2 random dye color tags
-- - 0-2 random source tags

-- First, ensure the tags column exists
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Create a temporary function to generate random tags for a post
CREATE OR REPLACE FUNCTION generate_random_tags()
RETURNS JSONB AS $$
DECLARE
    race_tags TEXT[] := ARRAY['Human', 'Asura', 'Norn', 'Charr', 'Sylvari'];
    gender_tags TEXT[] := ARRAY['Male', 'Female'];
    armor_tags TEXT[] := ARRAY['Light', 'Medium', 'Heavy'];
    class_tags TEXT[] := ARRAY['Guardian', 'Warrior', 'Engineer', 'Ranger', 'Thief', 'Elementalist', 'Mesmer', 'Necromancer', 'Revenant'];
    dye_tags TEXT[] := ARRAY['Gray dyes', 'Brown dyes', 'Red dyes', 'Orange dyes', 'Yellow dyes', 'Green dyes', 'Blue dyes', 'Purple dyes'];
    source_tags TEXT[] := ARRAY['Lunar New Year', 'Super Adventure Box', 'Dragon Bash', 'Four Winds', 'Halloween', 'Loot', 'Gems Store', 'Trading Post'];
    
    selected_tags JSONB := '[]'::jsonb;
    num_dyes INT;
    num_sources INT;
    i INT;
BEGIN
    -- Add 1 random race
    selected_tags := selected_tags || jsonb_build_array(race_tags[1 + floor(random() * array_length(race_tags, 1))::int]);
    
    -- Add 1 random gender
    selected_tags := selected_tags || jsonb_build_array(gender_tags[1 + floor(random() * array_length(gender_tags, 1))::int]);
    
    -- Add 1 random armor type
    selected_tags := selected_tags || jsonb_build_array(armor_tags[1 + floor(random() * array_length(armor_tags, 1))::int]);
    
    -- Add 1 random class
    selected_tags := selected_tags || jsonb_build_array(class_tags[1 + floor(random() * array_length(class_tags, 1))::int]);
    
    -- Add 0-2 random dye colors
    num_dyes := floor(random() * 3)::int; -- 0, 1, or 2
    FOR i IN 1..num_dyes LOOP
        selected_tags := selected_tags || jsonb_build_array(dye_tags[1 + floor(random() * array_length(dye_tags, 1))::int]);
    END LOOP;
    
    -- Add 0-2 random sources
    num_sources := floor(random() * 3)::int; -- 0, 1, or 2
    FOR i IN 1..num_sources LOOP
        selected_tags := selected_tags || jsonb_build_array(source_tags[1 + floor(random() * array_length(source_tags, 1))::int]);
    END LOOP;
    
    RETURN selected_tags;
END;
$$ LANGUAGE plpgsql;

-- Update all posts with random tags
UPDATE posts
SET tags = generate_random_tags()
WHERE tags = '[]'::jsonb OR tags IS NULL;

-- Drop the temporary function
DROP FUNCTION generate_random_tags();

-- Verify the update
SELECT 
    id,
    title,
    tags,
    jsonb_array_length(tags) as tag_count
FROM posts
ORDER BY id
LIMIT 10;

-- Show tag distribution
SELECT 
    jsonb_array_elements_text(tags) as tag,
    COUNT(*) as count
FROM posts
GROUP BY tag
ORDER BY count DESC;
