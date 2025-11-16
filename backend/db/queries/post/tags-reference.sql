-- GW2Style Tags Reference
-- This is a reference list of all valid tags organized by category
-- Tags are stored as JSONB array in posts.tags column

-- Example tag structure in posts table:
-- tags: ["Human", "Male", "Heavy", "Guardian", "Red dyes", "Halloween", "Carapace Armor"]

-- RACE TAGS
-- Human, Asura, Norn, Charr, Sylvari

-- GENDER TAGS
-- Male, Female

-- ARMOR TYPE TAGS
-- Light, Medium, Heavy

-- CLASS TAGS (Guild Wars 2)
-- Guardian, Warrior, Engineer, Ranger, Thief, Elementalist, Mesmer, Necromancer, Revenant

-- DYE COLOR TAGS
-- Gray dyes, Brown dyes, Red dyes, Orange dyes, Yellow dyes, Green dyes, Blue dyes, Purple dyes

-- SOURCE TAGS
-- Lunar New Year, Super Adventure Box, Dragon Bash, Four Winds, Halloween
-- Loot, Gems Store, Trading Post
-- (More sources can be added as needed)

-- ARMOR SKIN TAGS
-- Specific armor skin names can be added as tags (e.g., "Carapace Armor", "Bladed Armor")

-- ============================================
-- QUERY EXAMPLES FOR TAG FILTERING
-- ============================================

-- Find posts with a specific tag
-- SELECT * FROM posts WHERE tags @> '["Human"]'::jsonb;

-- Find posts with multiple tags (AND condition - must have ALL tags)
-- SELECT * FROM posts WHERE tags @> '["Human", "Male", "Heavy"]'::jsonb;

-- Find posts with any of the tags (OR condition - must have ANY tag)
-- SELECT * FROM posts WHERE tags ?| array['Human', 'Asura', 'Norn'];

-- Find posts with specific race AND armor type
-- SELECT * FROM posts WHERE tags @> '["Human", "Heavy"]'::jsonb;

-- Find posts with specific dye color
-- SELECT * FROM posts WHERE tags @> '["Red dyes"]'::jsonb;

-- Count posts by tag
-- SELECT jsonb_array_elements_text(tags) as tag, COUNT(*) 
-- FROM posts 
-- GROUP BY tag 
-- ORDER BY COUNT(*) DESC;

-- Find posts with tag combinations (e.g., Human Heavy Guardian with Red dyes)
-- SELECT * FROM posts 
-- WHERE tags @> '["Human", "Heavy", "Guardian", "Red dyes"]'::jsonb 
-- AND published = true;
