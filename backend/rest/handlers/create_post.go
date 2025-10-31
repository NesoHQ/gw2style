package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/NesoHQ/gw2style/repo"
	"github.com/NesoHQ/gw2style/rest/utils"
)

type CreatePostRequest struct {
	Title        string          `json:"title"`
	Description  string          `json:"description"`
	ThumbnailURL string          `json:"thumbnailUrl"`
	Image1URL    string          `json:"image1Url"`
	Image2URL    string          `json:"image2Url"`
	Image3URL    string          `json:"image3Url"`
	Image4URL    string          `json:"image4Url"`
	Image5URL    string          `json:"image5Url"`
	Equipments   json.RawMessage `json:"equipments"` // Will store GW2 equipment data
	TagID        int             `json:"tagId"`
	Published    bool            `json:"published"`
}

func (h *Handlers) CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	// Get user from JWT context
	user, err := utils.GetUserFromContext(r.Context())
	if err != nil {
		utils.SendError(w, http.StatusUnauthorized, "unauthorized", err)
		return
	}

	var req CreatePostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid request body", err)
		return
	}

	// Validate required fields
	if req.Title == "" {
		utils.SendError(w, http.StatusBadRequest, "title is required", nil)
		return
	}

	// Create post in database
	post := &repo.Post{
		Title:       req.Title,
		Description: req.Description,
		Thumbnail:   req.ThumbnailURL,
		Image1:      req.Image1URL,
		Image2:      req.Image2URL,
		Image3:      req.Image3URL,
		Image4:      req.Image4URL,
		Image5:      req.Image5URL,
		Equipments:  req.Equipments,
		AuthorName:  user.Name,
		TagID:       req.TagID,
		Published:   req.Published,
	}

	createdPost, err := h.postRepo.Create(*post)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "failed to create post", err)
		return
	}

	utils.SendData(w, http.StatusCreated, createdPost)
}
