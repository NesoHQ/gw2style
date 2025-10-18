INSERT INTO
    posts (
        title,
        thumbnail_url,
        image1_url,
        image2_url,
        image3_url,
        image4_url,
        image5_url,
        description,
        author_name,
        tag_id,
        created_at,
        updated_at,
        likes_count,
        published
    )
VALUES
    (
        'Amazing Sunset Photography',
        'https://example.com/thumb1.jpg',
        'https://example.com/image1_1.jpg',
        'https://example.com/image1_2.jpg',
        'https://example.com/image1_3.jpg',
        'https://example.com/image1_4.jpg',
        'https://example.com/image1_5.jpg',
        'A beautiful collection of sunset photographs from around the world.',
        'Account.1234',
        1,
        NOW (),
        NOW (),
        10,
        TRUE
    );