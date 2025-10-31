package middlewares

import (
	"context"
	"net/http"

	"github.com/NesoHQ/gw2style/rest/utils"
)

// AuthenticateJWT middleware validates the JWT token and sets the user in context
func (m *Middlewares) AuthenticateJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get JWT from Cookie
		cookie, err := r.Cookie("jwt")
		if err != nil {
			utils.SendError(w, http.StatusUnauthorized, "missing authentication token", nil)
			return
		}

		// Validate JWT token
		token := cookie.Value
		claims, err := utils.ValidateJWT(token)
		if err != nil {
			utils.SendError(w, http.StatusUnauthorized, "invalid token", err)
			return
		}

		// Create user from claims
		user := &utils.User{
			ID:   claims.UserID,
			Name: claims.Username,
		}

		// Add user to request context
		ctx := context.WithValue(r.Context(), utils.UserContextKey, user)

		// Call next handler with updated context
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
