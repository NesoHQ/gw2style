package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/NesoHQ/gw2style/repo"
	"github.com/NesoHQ/gw2style/rest/utils"
)

// LikePost handles POST /api/v1/posts/{id}/like
// Requires authentication
func (h *Handlers) LikePost(w http.ResponseWriter, r *http.Request) {
	// Get authenticated user from context
	user, ok := r.Context().Value(utils.UserContextKey).(*utils.User)
	if !ok || user == nil {
		h.sendError(w, http.StatusUnauthorized, "user not authenticated")
		return
	}

	// Get post ID from URL path
	// URL format: /api/v1/posts/{id}/like
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		h.sendError(w, http.StatusBadRequest, "invalid URL format")
		return
	}
	postID := pathParts[3] // posts is at index 2, id is at index 3
	if postID == "" {
		h.sendError(w, http.StatusBadRequest, "post ID is required")
		return
	}

	// Check if post exists
	post, err := h.postRepo.GetPostByID(r.Context(), postID)
	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "error fetching post")
		return
	}
	if post == nil {
		h.sendError(w, http.StatusNotFound, "post not found")
		return
	}

	// Create like repository
	likeRepo := repo.NewLikeRepository(h.DB.DB)

	// Add like
	err = likeRepo.LikePost(r.Context(), postID, user.ID)
	if err != nil {
		if err.Error() == "user already liked this post" {
			h.sendError(w, http.StatusConflict, "you already liked this post")
			return
		}
		h.sendError(w, http.StatusInternalServerError, "error liking post")
		return
	}

	// Get updated likes count
	likesCount, err := likeRepo.GetPostLikesCount(r.Context(), postID)
	if err != nil {
		likesCount = post.LikesCount + 1 // Fallback to incremented count
	}

	// Send success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":     true,
		"message":     "post liked successfully",
		"likes_count": likesCount,
		"liked":       true,
	})
}

// UnlikePost handles DELETE /api/v1/posts/{id}/like
// Requires authentication
func (h *Handlers) UnlikePost(w http.ResponseWriter, r *http.Request) {
	// Get authenticated user from context
	user, ok := r.Context().Value(utils.UserContextKey).(*utils.User)
	if !ok || user == nil {
		h.sendError(w, http.StatusUnauthorized, "user not authenticated")
		return
	}

	// Get post ID from URL path
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		h.sendError(w, http.StatusBadRequest, "invalid URL format")
		return
	}
	postID := pathParts[3]
	if postID == "" {
		h.sendError(w, http.StatusBadRequest, "post ID is required")
		return
	}

	// Check if post exists
	post, err := h.postRepo.GetPostByID(r.Context(), postID)
	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "error fetching post")
		return
	}
	if post == nil {
		h.sendError(w, http.StatusNotFound, "post not found")
		return
	}

	// Create like repository
	likeRepo := repo.NewLikeRepository(h.DB.DB)

	// Remove like
	err = likeRepo.UnlikePost(r.Context(), postID, user.ID)
	if err != nil {
		if err.Error() == "like not found" {
			h.sendError(w, http.StatusNotFound, "you haven't liked this post")
			return
		}
		h.sendError(w, http.StatusInternalServerError, "error unliking post")
		return
	}

	// Get updated likes count
	likesCount, err := likeRepo.GetPostLikesCount(r.Context(), postID)
	if err != nil {
		likesCount = post.LikesCount - 1 // Fallback to decremented count
		if likesCount < 0 {
			likesCount = 0
		}
	}

	// Send success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":     true,
		"message":     "post unliked successfully",
		"likes_count": likesCount,
		"liked":       false,
	})
}

// GetLikeStatus handles GET /api/v1/posts/{id}/like
// Returns whether the authenticated user has liked the post
// Requires authentication
func (h *Handlers) GetLikeStatus(w http.ResponseWriter, r *http.Request) {
	// Get authenticated user from context
	user, ok := r.Context().Value(utils.UserContextKey).(*utils.User)
	if !ok || user == nil {
		h.sendError(w, http.StatusUnauthorized, "user not authenticated")
		return
	}

	// Get post ID from URL path
	pathParts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(pathParts) < 4 {
		h.sendError(w, http.StatusBadRequest, "invalid URL format")
		return
	}
	postID := pathParts[3]
	if postID == "" {
		h.sendError(w, http.StatusBadRequest, "post ID is required")
		return
	}

	// Create like repository
	likeRepo := repo.NewLikeRepository(h.DB.DB)

	// Check if user has liked the post
	liked, err := likeRepo.HasUserLikedPost(r.Context(), postID, user.ID)
	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "error checking like status")
		return
	}

	// Get likes count
	likesCount, err := likeRepo.GetPostLikesCount(r.Context(), postID)
	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "error getting likes count")
		return
	}

	// Send response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":     true,
		"liked":       liked,
		"likes_count": likesCount,
	})
}

// GetUserLikedPosts handles GET /api/v1/user/liked-posts
// Returns all post IDs that the user has liked (for localStorage sync)
// Requires authentication
func (h *Handlers) GetUserLikedPosts(w http.ResponseWriter, r *http.Request) {
	// Get authenticated user from context
	user, ok := r.Context().Value(utils.UserContextKey).(*utils.User)
	if !ok || user == nil {
		h.sendError(w, http.StatusUnauthorized, "user not authenticated")
		return
	}

	// Query user's liked_posts directly
	var likedPostsJSON []byte
	query := `SELECT COALESCE(liked_posts, '[]'::json) FROM users WHERE id = $1`
	err := h.DB.QueryRow(query, user.ID).Scan(&likedPostsJSON)
	if err != nil {
		h.sendError(w, http.StatusInternalServerError, "error fetching liked posts")
		return
	}

	// Send response with raw JSON array
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":     true,
		"liked_posts": json.RawMessage(likedPostsJSON),
	})
}
