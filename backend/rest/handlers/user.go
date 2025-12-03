package handlers

import (
	"net/http"

	"github.com/NesoHQ/gw2style/rest/utils"
)

// GetCurrentUserHandler returns the currently authenticated user's information
func (h *Handlers) GetCurrentUserHandler(w http.ResponseWriter, r *http.Request) {
	// Get user from context (set by AuthenticateJWT middleware)
	user, ok := r.Context().Value(utils.UserContextKey).(*utils.User)
	if !ok || user == nil {
		utils.SendError(w, http.StatusUnauthorized, "user not found in context", nil)
		return
	}

	utils.SendData(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"user": map[string]interface{}{
			"id":       user.ID,
			"username": user.Name,
		},
	})
}

// LogoutHandler clears the JWT cookie
func (h *Handlers) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	// Clear the HTTP-only cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "jwt_token",
		Value:    "",
		HttpOnly: true,
		Secure:   false, // Set to true in production with HTTPS
		SameSite: http.SameSiteStrictMode,
		Path:     "/",
		MaxAge:   -1, // Delete cookie
	})

	utils.SendData(w, http.StatusOK, map[string]interface{}{
		"success": true,
		"message": "Logged out successfully",
	})
}
