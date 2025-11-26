package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/NesoHQ/gw2style/rest/utils"
)

type PublishPostRequest struct {
	ModeratorUsername  string `json:"moderator_username"`
	ModeratorDiscordID string `json:"moderator_discord_id"`
}

type RejectPostRequest struct {
	ModeratorUsername  string `json:"moderator_username"`
	ModeratorDiscordID string `json:"moderator_discord_id"`
	Reason             string `json:"reason"`
}

// PublishPostHandler approves and publishes a post
func (h *Handlers) PublishPostHandler(w http.ResponseWriter, r *http.Request) {
	postID := r.PathValue("id")
	if postID == "" {
		utils.SendError(w, http.StatusBadRequest, "post ID is required", nil)
		return
	}

	postIDInt, err := strconv.Atoi(postID)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid post ID", err)
		return
	}

	var req PublishPostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid request body", err)
		return
	}

	if req.ModeratorUsername == "" {
		utils.SendError(w, http.StatusBadRequest, "moderator_username is required", nil)
		return
	}

	err = h.moderationRepo.PublishPost(r.Context(), postIDInt, req.ModeratorUsername, req.ModeratorDiscordID)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "failed to publish post", err)
		return
	}

	utils.SendData(w, http.StatusOK, map[string]interface{}{
		"message": "post published successfully",
		"post_id": postID,
	})
}

// RejectPostHandler rejects a post
func (h *Handlers) RejectPostHandler(w http.ResponseWriter, r *http.Request) {
	postID := r.PathValue("id")
	if postID == "" {
		utils.SendError(w, http.StatusBadRequest, "post ID is required", nil)
		return
	}

	postIDInt, err := strconv.Atoi(postID)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid post ID", err)
		return
	}

	var req RejectPostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid request body", err)
		return
	}

	if req.ModeratorUsername == "" {
		utils.SendError(w, http.StatusBadRequest, "moderator_username is required", nil)
		return
	}

	if req.Reason == "" {
		req.Reason = "Rejected by moderator"
	}

	err = h.moderationRepo.RejectPost(r.Context(), postIDInt, req.ModeratorUsername, req.ModeratorDiscordID, req.Reason)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "failed to reject post", err)
		return
	}

	utils.SendData(w, http.StatusOK, map[string]interface{}{
		"message": "post rejected successfully",
		"post_id": postID,
	})
}
