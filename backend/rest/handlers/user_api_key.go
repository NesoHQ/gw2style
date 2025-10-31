package handlers

import (
	"net/http"

	"github.com/NesoHQ/gw2style/rest/utils"
)

func (h *Handlers) GetUserAPIKeyHandler(w http.ResponseWriter, r *http.Request) {
	// Get user from JWT context
	user, err := utils.GetUserFromContext(r.Context())
	if err != nil {
		utils.SendError(w, http.StatusUnauthorized, "unauthorized", err)
		return
	}

	// Get user details including API key
	dbUser, err := h.repoUser.FindUser(user.ID)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "failed to fetch user data", err)
		return
	}

	if dbUser == nil {
		utils.SendError(w, http.StatusNotFound, "user not found", nil)
		return
	}

	// Return only the API key
	response := struct {
		APIKey string `json:"apiKey"`
	}{
		APIKey: dbUser.ApiKey,
	}

	utils.SendData(w, http.StatusOK, response)
}
