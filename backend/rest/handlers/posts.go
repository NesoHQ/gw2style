package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"
	"strings"

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

	// Parse pagination parameters
	page := 1
	limit := 20 // Default limit
	maxLimit := 100

	if pageStr := r.URL.Query().Get("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
			if limit > maxLimit {
				limit = maxLimit
			}
		}
	}

	offset := (page - 1) * limit

	// Get posts from repository
	posts, totalCount, err := h.postRepo.GetPosts(r.Context(), limit, offset)
	if err != nil {
		slog.Error("Failed to fetch posts", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Failed to fetch posts: "+err.Error())
		return
	}

	// Calculate pagination metadata
	totalPages := (totalCount + limit - 1) / limit

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Create response structure
	response := map[string]interface{}{
		"success": true,
		"data":    posts,
		"pagination": map[string]interface{}{
			"page":        page,
			"limit":       limit,
			"total":       totalCount,
			"total_pages": totalPages,
		},
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

func (h *Handlers) GetPopularPostsHandler(w http.ResponseWriter, r *http.Request) {
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
	timeframe := r.URL.Query().Get("timeframe")
	limit := 100 // Default to top 100 posts

	// Get popular posts from repository
	posts, err := h.postRepo.GetPopularPosts(r.Context(), timeframe, limit)
	if err != nil {
		slog.Error("Failed to fetch popular posts", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Failed to fetch popular posts")
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
	tagsParam := r.URL.Query().Get("tags") // Comma-separated tags
	authorName := r.URL.Query().Get("author")

	// Parse pagination parameters
	page := 1
	limit := 20
	maxLimit := 100

	if pageStr := r.URL.Query().Get("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
			if limit > maxLimit {
				limit = maxLimit
			}
		}
	}

	offset := (page - 1) * limit

	// Parse tags if provided (comma-separated)
	var tags []string
	if tagsParam != "" {
		tags = strings.Split(tagsParam, ",")
		// Trim whitespace from each tag
		for i := range tags {
			tags[i] = strings.TrimSpace(tags[i])
		}
	}

	slog.Info("Search request",
		"query", query,
		"tags", tags,
		"author", authorName,
		"page", page,
		"limit", limit,
	)

	// Prepare search parameters
	params := repo.SearchParams{
		Query:         query,
		Tags:          tags,
		OnlyPublished: true,
		AuthorName:    authorName,
		Limit:         limit,
		Offset:        offset,
	}

	// Get posts from repository
	posts, totalCount, err := h.postRepo.SearchPosts(r.Context(), params)
	if err != nil {
		slog.Error("Failed to search posts", "error", err.Error())
		h.sendError(w, http.StatusInternalServerError, "Failed to search posts")
		return
	}

	// Calculate pagination metadata
	totalPages := 0
	if totalCount > 0 {
		totalPages = (totalCount + limit - 1) / limit
	}

	slog.Info("Search results", "count", len(posts), "total", totalCount)

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Create response structure
	response := map[string]interface{}{
		"success": true,
		"data":    posts,
		"pagination": map[string]interface{}{
			"page":        page,
			"limit":       limit,
			"total":       totalCount,
			"total_pages": totalPages,
		},
	}

	// Encode response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		h.sendError(w, http.StatusInternalServerError, "Failed to encode response")
		return
	}
}
