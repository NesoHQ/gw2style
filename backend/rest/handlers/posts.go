package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/NesoHQ/gw2style/repo"
)

func (h *Handlers) GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	// Only allow GET method
	if r.Method != http.MethodGet {
		h.sendError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Check if postRepo is initialized
	if h.postRepo == nil {
		slog.Error("Post repository not initialized")
		h.sendError(w, http.StatusInternalServerError, "Post repository not initialized")
		return
	}

	// Get posts from repository
	posts, err := h.postRepo.GetPosts(r.Context())
	if err != nil {
		slog.Error("Failed to fetch posts", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Failed to fetch posts: "+err.Error())
		return
	}

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Create response structure
	response := map[string]interface{}{
		"success": true,
		"data":    posts,
	}

	// Encode response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.sendError(w, http.StatusInternalServerError, "Failed to encode response")
		return
	}
}

// SearchPostsHandler handles search requests for posts
func (h *Handlers) GetPostByIDHandler(w http.ResponseWriter, r *http.Request) {
	// Only allow GET method
	if r.Method != http.MethodGet {
		h.sendError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Get post ID from URL path
	postID := r.URL.Path[len("/api/v1/posts/"):]
	if postID == "" {
		h.sendError(w, http.StatusBadRequest, "Post ID is required")
		return
	}

	// Check if postRepo is initialized
	if h.postRepo == nil {
		slog.Error("Post repository not initialized")
		h.sendError(w, http.StatusInternalServerError, "Post repository not initialized")
		return
	}

	// Get post from repository
	post, err := h.postRepo.GetPostByID(r.Context(), postID)
	if err != nil {
		slog.Error("Failed to fetch post", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Failed to fetch post")
		return
	}

	if post == nil {
		h.sendError(w, http.StatusNotFound, "Post not found")
		return
	}

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Create response structure
	response := map[string]interface{}{
		"success": true,
		"data":    post,
	}

	// Encode response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.sendError(w, http.StatusInternalServerError, "Failed to encode response")
		return
	}
}

func (h *Handlers) SearchPostsHandler(w http.ResponseWriter, r *http.Request) {
	// Only allow GET method
	if r.Method != http.MethodGet {
		h.sendError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Check if postRepo is initialized
	if h.postRepo == nil {
		slog.Error("Post repository not initialized")
		h.sendError(w, http.StatusInternalServerError, "Post repository not initialized")
		return
	}

	// Parse query parameters
	query := r.URL.Query().Get("q")
	tagIDStr := r.URL.Query().Get("tag")
	authorName := r.URL.Query().Get("author")

	slog.Info("Search request",
		"query", query,
		"tagID", tagIDStr,
		"author", authorName,
	)

	// Parse tag ID if provided
	var tagID *int
	if tagIDStr != "" {
		id, err := strconv.Atoi(tagIDStr)
		if err != nil {
			h.sendError(w, http.StatusBadRequest, "Invalid tag ID")
			return
		}
		tagID = &id
	}

	// Prepare search parameters
	params := repo.SearchParams{
		Query:         query,
		TagID:         tagID,
		OnlyPublished: true,
		AuthorName:    authorName,
	}

	// Get posts from repository
	posts, err := h.postRepo.SearchPosts(r.Context(), params)
	if err != nil {
		slog.Error("Failed to search posts", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Failed to search posts")
		return
	}

	slog.Info("Search results", "count", len(posts))

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Create response structure
	response := map[string]interface{}{
		"success": true,
		"data":    posts,
	}

	// Encode response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.sendError(w, http.StatusInternalServerError, "Failed to encode response")
		return
	}
}
