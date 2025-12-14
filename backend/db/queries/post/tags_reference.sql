-- GW2Style Tags Reference
-- This is a reference list of all valid tags organized by category
-- Tags are stored as JSONB array in posts.tags column

-- Example tag structure in posts table:
-- tags: ["Human", "Male", "Guardian", "Red dyes", "Carapace Armor"]

-- RACE TAGS
-- Human, Asura, Norn, Charr, Sylvari

-- GENDER TAGS
-- Male, Female

-- CLASS TAGS (Guild Wars 2)
-- Guardian, Warrior, Engineer, Ranger, Thief, Elementalist, Mesmer, Necromancer, Revenant

-- DYE COLOR TAGS
-- Gray dyes, Brown dyes, Red dyes, Orange dyes, Yellow dyes, Green dyes, Blue dyes, Purple dyes

-- ARMOR SKIN TAGS
-- Specific armor skin names can be added as tags (e.g., "Carapace Armor", "Bladed Armor")

-- ============================================
-- QUERY EXAMPLES FOR TAG FILTERING
-- ============================================

-- Find posts with multiple tags (AND condition - must have ALL tags)
SELECT * FROM posts 
    WHERE tags @> '["Human", "Male", "etc.."]'::jsonb
    AND published = true;

-- Find posts with tag combinations (e.g., Human Guardian with Red dyes)
SELECT * FROM posts 
    WHERE tags @> '["Human", "Guardian", "Red dyes"]'::jsonb 
    AND published = true;
