package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
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
