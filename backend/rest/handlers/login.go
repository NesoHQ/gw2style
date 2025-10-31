package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/NesoHQ/gw2style/repo"
	"github.com/NesoHQ/gw2style/rest/utils"
)

func (h *Handlers) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		APIKey string `json:"apiKey"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.SendError(w, http.StatusBadRequest, "invalid JSON body", nil)
		return
	}
	apiKey := req.APIKey
	if apiKey == "" {
		utils.SendError(w, http.StatusBadRequest, "API key is required", nil)
		return
	}

	hasRequiredPermissions, err := utils.HasRequiredPermissions(apiKey)
	if err != nil {
		utils.SendError(w, http.StatusForbidden, err.Error(), err)
		return
	}

	if !hasRequiredPermissions {
		utils.SendError(w, http.StatusForbidden, "missing required permissions", nil)
		return
	}

	userInfo, err := utils.GetUserInfo(apiKey)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error(), err)
		return
	}

	fmt.Println(userInfo)

	user, err := h.repoUser.FindUser(userInfo.ID)
	if err != nil {
		utils.SendData(w, http.StatusInternalServerError, "DB error: "+err.Error())
		return
	}

	if user == nil {
		_, err = h.repoUser.Create(repo.User{
			ID:     userInfo.ID,
			Name:   userInfo.Name,
			ApiKey: apiKey,
		})
		if err != nil {
			utils.SendError(w, http.StatusInternalServerError, "Failed to create user: "+err.Error(), err)
			return
		}
	}

	JWT, err := utils.GenerateJWT(utils.User{
		ID:   userInfo.ID,
		Name: userInfo.Name,
	})
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to generate token", err)
		return
	}

	utils.SendData(w, http.StatusOK, JWT)
}
