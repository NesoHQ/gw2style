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
        tag_id INT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        likes_count INT,
        published BOOLEAN DEFAULT FALSE,
        CONSTRAINT fk_author FOREIGN KEY (author_name) REFERENCES users (username) ON DELETE SET NULL
    );