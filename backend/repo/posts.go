package repo

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
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
	TagID       int         `json:"tag_id"`
	CreatedAt   string      `json:"created_at"`
	LikesCount  int         `json:"likes_count"`
	Published   bool        `json:"published"`
	Views       int         `json:"views"`
}

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{
		db: db,
	}
}

func (r *PostRepository) GetPosts(ctx context.Context) ([]Post, error) {
	return r.SearchPosts(ctx, SearchParams{OnlyPublished: true})
}

type SearchParams struct {
	Query         string
	TagID         *int
	OnlyPublished bool
	AuthorName    string
}

func (r *PostRepository) SearchPosts(ctx context.Context, params SearchParams) ([]Post, error) {
	queryArgs := []interface{}{}
	conditions := []string{}

	if params.OnlyPublished {
		conditions = append(conditions, "published = true")
	}

	if params.Query != "" {
		queryArgs = append(queryArgs, "%"+params.Query+"%", "%"+params.Query+"%")
		conditions = append(conditions, "(title ILIKE $"+fmt.Sprint(len(queryArgs)-1)+" OR description ILIKE $"+fmt.Sprint(len(queryArgs))+")")
	}

	if params.TagID != nil {
		queryArgs = append(queryArgs, *params.TagID)
		conditions = append(conditions, "tag_id = $"+fmt.Sprint(len(queryArgs)))
	}

	if params.AuthorName != "" {
		queryArgs = append(queryArgs, params.AuthorName)
		conditions = append(conditions, "author_name = $"+fmt.Sprint(len(queryArgs)))
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
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
			COALESCE(tag_id, 0) as tag_id,
			to_char(COALESCE(created_at, NOW()), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at,
			COALESCE(likes_count, 0) as likes_count,
			COALESCE(published, false) as published
		FROM posts`

	query := baseQuery + " " + whereClause + " ORDER BY created_at DESC"

	rows, err := r.db.QueryContext(ctx, query, queryArgs...)
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
			&post.TagID,
			&post.CreatedAt,
			&post.LikesCount,
			&post.Published,
		)
		// Set default value for views since it's not in the query yet
		post.Views = 0
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
