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
		utils.SendData(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	apiKey := req.APIKey
	if apiKey == "" {
		utils.SendData(w, http.StatusBadRequest, "API key is required")
		return
	}

	hasRequiredPermissions, err := utils.HasRequiredPermissions(apiKey)
	if err != nil {
		utils.SendData(w, http.StatusForbidden, err.Error())
		return
	}

	if !hasRequiredPermissions {
		utils.SendData(w, http.StatusForbidden, "missing required permissions")
		return
	}

	userInfo, err := utils.GetUserInfo(apiKey)
	if err != nil {
		utils.SendData(w, http.StatusInternalServerError, err.Error())
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
			ID:   userInfo.ID,
			Name: userInfo.Name,
		})
		if err != nil {
			utils.SendData(w, http.StatusInternalServerError, "Failed to create user: "+err.Error())
			return
		}
	}

	JWT, err := utils.GenerateJWT(utils.User{
		ID:   userInfo.ID,
		Name: userInfo.Name,
	})
	if err != nil {
		utils.SendData(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	utils.SendData(w, http.StatusOK, JWT)
}
