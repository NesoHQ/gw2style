package repo

import (
	"context"
	"database/sql"
	"fmt"
)

type LikeRepository struct {
	db *sql.DB
}

func NewLikeRepository(db *sql.DB) *LikeRepository {
	return &LikeRepository{
		db: db,
	}
}

// LikePost adds a like to a post by a user
// Updates posts.likes_count and users.liked_posts in a single transaction
func (r *LikeRepository) LikePost(ctx context.Context, postID, userID string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback()

	// Check if user already liked this post by checking their liked_posts array
	var likedPosts []byte
	checkQuery := `SELECT COALESCE(liked_posts, '[]'::json) FROM users WHERE id = $1`
	err = tx.QueryRowContext(ctx, checkQuery, userID).Scan(&likedPosts)
	if err != nil {
		return fmt.Errorf("error checking user's liked posts: %w", err)
	}

	// Check if post ID already exists in the array
	checkExistsQuery := `SELECT EXISTS(
		SELECT 1 FROM users 
		WHERE id = $1 AND liked_posts::jsonb @> $2::jsonb
	)`
	var alreadyLiked bool
	err = tx.QueryRowContext(ctx, checkExistsQuery, userID, fmt.Sprintf(`["%s"]`, postID)).Scan(&alreadyLiked)
	if err != nil {
		return fmt.Errorf("error checking if already liked: %w", err)
	}

	if alreadyLiked {
		return fmt.Errorf("user already liked this post")
	}

	// Add post ID to user's liked_posts array
	updateUserQuery := `
		UPDATE users 
		SET liked_posts = COALESCE(liked_posts, '[]'::json)::jsonb || $1::jsonb
		WHERE id = $2
	`
	_, err = tx.ExecContext(ctx, updateUserQuery, fmt.Sprintf(`["%s"]`, postID), userID)
	if err != nil {
		return fmt.Errorf("error updating user's liked posts: %w", err)
	}

	// Increment likes_count in posts table
	updatePostQuery := `UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1`
	_, err = tx.ExecContext(ctx, updatePostQuery, postID)
	if err != nil {
		return fmt.Errorf("error updating post likes count: %w", err)
	}

	if err = tx.Commit(); err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

// UnlikePost removes a like from a post by a user
// Updates posts.likes_count and users.liked_posts in a single transaction
func (r *LikeRepository) UnlikePost(ctx context.Context, postID, userID string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback()

	// Check if user has liked this post
	checkExistsQuery := `SELECT EXISTS(
		SELECT 1 FROM users 
		WHERE id = $1 AND liked_posts::jsonb @> $2::jsonb
	)`
	var hasLiked bool
	err = tx.QueryRowContext(ctx, checkExistsQuery, userID, fmt.Sprintf(`["%s"]`, postID)).Scan(&hasLiked)
	if err != nil {
		return fmt.Errorf("error checking if liked: %w", err)
	}

	if !hasLiked {
		return fmt.Errorf("like not found")
	}

	// Remove post ID from user's liked_posts array
	updateUserQuery := `
		UPDATE users 
		SET liked_posts = (
			SELECT jsonb_agg(elem)
			FROM jsonb_array_elements(COALESCE(liked_posts, '[]'::json)::jsonb) elem
			WHERE elem::text != $1
		)
		WHERE id = $2
	`
	_, err = tx.ExecContext(ctx, updateUserQuery, fmt.Sprintf(`"%s"`, postID), userID)
	if err != nil {
		return fmt.Errorf("error updating user's liked posts: %w", err)
	}

	// Decrement likes_count in posts table (never go below 0)
	updatePostQuery := `UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1`
	_, err = tx.ExecContext(ctx, updatePostQuery, postID)
	if err != nil {
		return fmt.Errorf("error updating post likes count: %w", err)
	}

	if err = tx.Commit(); err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

// HasUserLikedPost checks if a user has liked a specific post
// Reads from users.liked_posts array
func (r *LikeRepository) HasUserLikedPost(ctx context.Context, postID, userID string) (bool, error) {
	var hasLiked bool
	query := `
		SELECT EXISTS(
			SELECT 1 FROM users 
			WHERE id = $1 AND liked_posts::jsonb @> $2::jsonb
		)
	`
	err := r.db.QueryRowContext(ctx, query, userID, fmt.Sprintf(`["%s"]`, postID)).Scan(&hasLiked)
	if err != nil {
		return false, fmt.Errorf("error checking like status: %w", err)
	}
	return hasLiked, nil
}

// GetPostLikesCount returns the number of likes for a post
// Reads directly from posts.likes_count (source of truth)
func (r *LikeRepository) GetPostLikesCount(ctx context.Context, postID string) (int, error) {
	var count int
	query := `SELECT COALESCE(likes_count, 0) FROM posts WHERE id = $1`
	err := r.db.QueryRowContext(ctx, query, postID).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error getting likes count: %w", err)
	}
	return count, nil
}

// GetUserLikedPosts returns all post IDs that a user has liked
// Used for frontend localStorage sync
func (r *LikeRepository) GetUserLikedPosts(ctx context.Context, userID string) ([]string, error) {
	var likedPostsJSON []byte
	query := `SELECT COALESCE(liked_posts, '[]'::json) FROM users WHERE id = $1`
	err := r.db.QueryRowContext(ctx, query, userID).Scan(&likedPostsJSON)
	if err != nil {
		return nil, fmt.Errorf("error getting user's liked posts: %w", err)
	}

	// Parse JSON array to string slice
	// This will be handled by the handler layer
	return nil, nil // Handler will parse the JSON
}
