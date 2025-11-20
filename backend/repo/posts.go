package repo

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

type Post struct {
	ID          string      `json:"id"`
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Thumbnail   string      `json:"thumbnail"`
	Image1      string      `json:"image1"`
	Image2      string      `json:"image2"`
	Image3      string      `json:"image3"`
	Image4      string      `json:"image4"`
	Image5      string      `json:"image5"`
	Equipments  interface{} `json:"equipments"` // Using interface{} for JSON
	AuthorName  string      `json:"author_name"`
	Tags        interface{} `json:"tags"` // JSONB array of tags
	CreatedAt   string      `json:"created_at"`
	LikesCount  int         `json:"likes_count"`
	Published   bool        `json:"published"`
}

type PostSummary struct {
	ID         string `json:"id"`
	Title      string `json:"title"`
	Thumbnail  string `json:"thumbnail"`
	AuthorName string `json:"author_name"`
	LikesCount int    `json:"likes_count"`
}

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{
		db: db,
	}
}

func (r *PostRepository) GetPosts(ctx context.Context, limit, offset int) ([]PostSummary, int, error) {
	queryArgs := []interface{}{limit, offset}

	// Get total count
	countQuery := "SELECT COUNT(*) FROM posts WHERE published = true"
	var totalCount int
	err := r.db.QueryRowContext(ctx, countQuery).Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("error getting total count: %w", err)
	}

	query := `
		SELECT 
			CAST(id AS TEXT),
			COALESCE(title, '') as title,
			COALESCE(thumbnail_url, '') as thumbnail,
			COALESCE(author_name, '') as author_name,
			COALESCE(likes_count, 0) as likes_count
		FROM posts
		WHERE published = true
		ORDER BY CAST(id AS INTEGER) DESC
		LIMIT $1 OFFSET $2`

	rows, err := r.db.QueryContext(ctx, query, queryArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var posts []PostSummary
	for rows.Next() {
		var post PostSummary
		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Thumbnail,
			&post.AuthorName,
			&post.LikesCount,
		)
		if err != nil {
			return nil, 0, err
		}
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, err
	}

	return posts, totalCount, nil
}

type SearchParams struct {
	Query         string
	Tags          []string // Array of tags to filter by (AND condition)
	OnlyPublished bool
	AuthorName    string
	Limit         int
	Offset        int
}

// Create adds a new post to the database
func (r *PostRepository) Create(post Post) (*Post, error) {
	query := `
		INSERT INTO posts (
			title, description, thumbnail_url, image1_url, image2_url, 
			image3_url, image4_url, image5_url, equipments, author_name, 
			tags, published
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
		) RETURNING id`

	var id string
	err := r.db.QueryRow(
		query,
		post.Title, post.Description, post.Thumbnail, post.Image1,
		post.Image2, post.Image3, post.Image4, post.Image5,
		post.Equipments, post.AuthorName, post.Tags, post.Published,
	).Scan(&id)

	if err != nil {
		return nil, fmt.Errorf("error creating post: %w", err)
	}

	post.ID = id
	post.CreatedAt = time.Now().Format(time.RFC3339)
	post.LikesCount = 0

	return &post, nil
}

// GetPostByID retrieves a single post by its ID
func (r *PostRepository) GetPostByID(ctx context.Context, id string) (*Post, error) {
	query := `
		SELECT 
			CAST(id AS TEXT),
			COALESCE(title, '') as title,
			COALESCE(description, '') as description,
			COALESCE(thumbnail_url, '') as thumbnail,
			COALESCE(image1_url, '') as image1,
			COALESCE(image2_url, '') as image2,
			COALESCE(image3_url, '') as image3,
			COALESCE(image4_url, '') as image4,
			COALESCE(image5_url, '') as image5,
			equipments,
			COALESCE(author_name, '') as author_name,
			COALESCE(tags, '[]'::jsonb) as tags,
			to_char(COALESCE(created_at, NOW()), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
			COALESCE(likes_count, 0) as likes_count,
			COALESCE(published, false) as published
		FROM posts
		WHERE id = $1`

	var post Post
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&post.ID,
		&post.Title,
		&post.Description,
		&post.Thumbnail,
		&post.Image1,
		&post.Image2,
		&post.Image3,
		&post.Image4,
		&post.Image5,
		&post.Equipments,
		&post.AuthorName,
		&post.Tags,
		&post.CreatedAt,
		&post.LikesCount,
		&post.Published,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}

	if err != nil {
		return nil, fmt.Errorf("error getting post: %w", err)
	}

	return &post, nil
}

func (r *PostRepository) GetPopularPosts(ctx context.Context, timeframe string, limit int) ([]Post, error) {
	var timeCondition string
	switch timeframe {
	case "week":
		// Start of current week (Monday)
		timeCondition = "AND created_at >= DATE_TRUNC('week', NOW())"
	case "month":
		// Start of current month
		timeCondition = "AND created_at >= DATE_TRUNC('month', NOW())"
	default:
		timeCondition = ""
	}

	query := fmt.Sprintf(`
		SELECT 
			CAST(id AS TEXT),
			COALESCE(title, '') as title,
			COALESCE(description, '') as description,
			COALESCE(thumbnail_url, '') as thumbnail,
			COALESCE(image1_url, '') as image1,
			COALESCE(image2_url, '') as image2,
			COALESCE(image3_url, '') as image3,
			COALESCE(image4_url, '') as image4,
			COALESCE(image5_url, '') as image5,
			equipments,
			COALESCE(author_name, '') as author_name,
			COALESCE(tags, '[]'::jsonb) as tags,
			to_char(COALESCE(created_at, NOW()), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
			COALESCE(likes_count, 0) as likes_count,
			COALESCE(published, false) as published
		FROM posts
		WHERE published = true %s
		ORDER BY likes_count DESC
		LIMIT $1`, timeCondition)

	rows, err := r.db.QueryContext(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Description,
			&post.Thumbnail,
			&post.Image1,
			&post.Image2,
			&post.Image3,
			&post.Image4,
			&post.Image5,
			&post.Equipments,
			&post.AuthorName,
			&post.Tags,
			&post.CreatedAt,
			&post.LikesCount,
			&post.Published,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

// DeletePost soft deletes a post by setting published to false
func (r *PostRepository) DeletePost(ctx context.Context, postID string) error {
	query := `UPDATE posts SET published = false WHERE id = $1`
	result, err := r.db.ExecContext(ctx, query, postID)
	if err != nil {
		return fmt.Errorf("error deleting post: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("error checking rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return fmt.Errorf("post not found")
	}

	return nil
}

func (r *PostRepository) SearchPosts(ctx context.Context, params SearchParams) ([]Post, int, error) {
	queryArgs := []interface{}{}
	conditions := []string{}

	if params.OnlyPublished {
		conditions = append(conditions, "published = true")
	}

	if params.Query != "" {
		queryArgs = append(queryArgs, "%"+params.Query+"%", "%"+params.Query+"%")
		conditions = append(conditions, "(title ILIKE $"+fmt.Sprint(len(queryArgs)-1)+" OR description ILIKE $"+fmt.Sprint(len(queryArgs))+")")
	}

	// Filter by tags using JSONB contains operator (@>)
	if len(params.Tags) > 0 {
		tagsJSON, err := json.Marshal(params.Tags)
		if err != nil {
			return nil, 0, fmt.Errorf("error marshaling tags: %w", err)
		}
		queryArgs = append(queryArgs, string(tagsJSON))
		conditions = append(conditions, "tags @> $"+fmt.Sprint(len(queryArgs))+"::jsonb")
	}

	if params.AuthorName != "" {
		queryArgs = append(queryArgs, params.AuthorName)
		conditions = append(conditions, "author_name = $"+fmt.Sprint(len(queryArgs)))
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	// Get total count
	countQuery := "SELECT COUNT(*) FROM posts " + whereClause
	var totalCount int
	err := r.db.QueryRowContext(ctx, countQuery, queryArgs...).Scan(&totalCount)
	if err != nil {
		return nil, 0, fmt.Errorf("error getting total count: %w", err)
	}

	baseQuery := `
		SELECT 
			CAST(id AS TEXT),
			COALESCE(title, '') as title,
			COALESCE(description, '') as description,
			COALESCE(thumbnail_url, '') as thumbnail,
			COALESCE(image1_url, '') as image1,
			COALESCE(image2_url, '') as image2,
			COALESCE(image3_url, '') as image3,
			COALESCE(image4_url, '') as image4,
			COALESCE(image5_url, '') as image5,
			equipments,
			COALESCE(author_name, '') as author_name,
			COALESCE(tags, '[]'::jsonb) as tags,
			to_char(COALESCE(created_at, NOW()), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
			COALESCE(likes_count, 0) as likes_count,
			COALESCE(published, false) as published
		FROM posts`

	query := baseQuery + " " + whereClause + " ORDER BY created_at DESC"

	// Add pagination if limit is set
	if params.Limit > 0 {
		queryArgs = append(queryArgs, params.Limit, params.Offset)
		query += fmt.Sprintf(" LIMIT $%d OFFSET $%d", len(queryArgs)-1, len(queryArgs))
	}

	rows, err := r.db.QueryContext(ctx, query, queryArgs...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var post Post
		err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Description,
			&post.Thumbnail,
			&post.Image1,
			&post.Image2,
			&post.Image3,
			&post.Image4,
			&post.Image5,
			&post.Equipments,
			&post.AuthorName,
			&post.Tags,
			&post.CreatedAt,
			&post.LikesCount,
			&post.Published,
		)
		if err != nil {
			return nil, 0, err
		}
		posts = append(posts, post)
	}

	if err = rows.Err(); err != nil {
		return nil, 0, err
	}

	return posts, totalCount, nil
}
