CREATE TABLE
    posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(250) NOT NULL,
        description TEXT,
        thumbnail_url TEXT,
        image1_url TEXT,
        image2_url TEXT,
        image3_url TEXT,
        image4_url TEXT,
        image5_url TEXT,
        equipments JSON,
        author_name VARCHAR,
        tags JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ,
        likes_count INT DEFAULT 0,
        published BOOLEAN DEFAULT FALSE,
        CONSTRAINT fk_author FOREIGN KEY (author_name) REFERENCES users (username) ON DELETE SET NULL
    );

-- Create GIN index for efficient tag filtering
CREATE INDEX idx_posts_tags ON posts USING GIN (tags);

-- Create index for published posts with tags (common query pattern)
CREATE INDEX idx_posts_published_tags ON posts USING GIN (tags) WHERE published = true;