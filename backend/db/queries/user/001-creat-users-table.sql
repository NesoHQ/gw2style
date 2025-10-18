CREATE TABLE
    users (
        id VARCHAR PRIMARY KEY UNIQUE NOT NULL,
        username VARCHAR NOT NULL UNIQUE,
        created_at TIMESTAMPTZ DEFAULT now(),
        liked_posts JSON
    );