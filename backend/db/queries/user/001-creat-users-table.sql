CREATE TABLE
    users (
        id VARCHAR PRIMARY KEY UNIQUE NOT NULL,
        username VARCHAR NOT NULL UNIQUE,
		created_posts JSON,
		liked_posts JSON,
        created_at TIMESTAMPTZ DEFAULT now()
    );