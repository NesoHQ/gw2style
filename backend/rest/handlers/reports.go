package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/NesoHQ/gw2style/repo"
	"github.com/NesoHQ/gw2style/rest/utils"
)

type CreateReportRequest struct {
	Reason      string `json:"reason"`
	Description string `json:"description"`
}

// CreateReportHandler allows users to report posts
func (h *Handlers) CreateReportHandler(w http.ResponseWriter, r *http.Request) {
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

	// Get user from JWT context
	user, err := utils.GetUserFromContext(r.Context())
	if err != nil {
		utils.SendError(w, http.StatusUnauthorized, "unauthorized", err)
		return
	}

	var req CreateReportRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid request body", err)
		return
	}

	// Validate reason
	validReasons := map[string]bool{
		"nsfw":       true,
		"spam":       true,
		"off-topic":  true,
		"harassment": true,
		"other":      true,
	}

	if !validReasons[req.Reason] {
		utils.SendError(w, http.StatusBadRequest, "invalid reason", nil)
		return
	}

	report := repo.Report{
		PostID:           postIDInt,
		ReporterUsername: user.Name,
		Reason:           req.Reason,
		Description:      req.Description,
	}

	err = h.moderationRepo.CreateReport(r.Context(), report)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "failed to create report", err)
		return
	}

	utils.SendData(w, http.StatusCreated, map[string]interface{}{
		"message": "report submitted successfully",
		"post_id": postID,
	})
}
