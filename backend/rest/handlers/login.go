package handlers

import (
	"database/sql"
	"encoding/json"
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

	// First, try to find user by API key in database
	user, err := h.repoUser.FindUserByAPIKey(apiKey)
	if err != nil && err != sql.ErrNoRows {
		utils.SendError(w, http.StatusInternalServerError, "DB error: "+err.Error(), err)
		return
	}

	if user != nil {
		// User exists in database, skip GW2 API validation
		JWT, err := utils.GenerateJWT(utils.User{
			ID:   user.ID,
			Name: user.Name,
		})
		if err != nil {
			utils.SendError(w, http.StatusInternalServerError, "Failed to generate token", err)
			return
		}

		// Set HTTP-only cookie
		http.SetCookie(w, &http.Cookie{
			Name:     "jwt_token",
			Value:    JWT,
			HttpOnly: true,
			Secure:   false, // Set to true in production with HTTPS
			SameSite: http.SameSiteStrictMode,
			Path:     "/",
			MaxAge:   86400 * 7, // 7 days
		})

		// Return user data (not the token)
		utils.SendData(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"user": map[string]interface{}{
				"id":       user.ID,
				"username": user.Name,
			},
		})
		return
	}

	// If user not found in database, validate with GW2 API
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

	// Create new user in database
	newUser, err := h.repoUser.Create(repo.User{
		ID:     userInfo.ID,
		Name:   userInfo.Name,
		ApiKey: apiKey,
	})
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to create user: "+err.Error(), err)
		return
	}

	JWT, err := utils.GenerateJWT(utils.User{
		ID:   newUser.ID,
		Name: newUser.Name,
	})
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to generate token", err)
		return
	}

	// Set HTTP-only cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "jwt_token",
		Value:    JWT,
		HttpOnly: true,
		Secure:   false, // Set to true in production with HTTPS
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
		MaxAge:   86400 * 7, // 7 days
	})

	// Return user data (not the token)
	utils.SendData(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"user": map[string]interface{}{
			"id":       newUser.ID,
			"username": newUser.Name,
		},
	})
}
