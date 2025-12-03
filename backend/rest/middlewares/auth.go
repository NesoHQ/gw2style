package middlewares

import (
	"context"
	"net/http"

	"github.com/NesoHQ/gw2style/rest/utils"
)

// AuthenticateJWT middleware validates the JWT token and sets the user in context
func (m *Middlewares) AuthenticateJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var token string

		// Try to get JWT from cookie first (HTTP-only cookie)
		cookie, err := r.Cookie("jwt_token")
		if err == nil {
			token = cookie.Value
		} else {
			// Fallback: check old cookie name for backward compatibility
			cookie, err = r.Cookie("jwt")
			if err == nil {
				token = cookie.Value
			}
		}

		// If no cookie found, check Authorization header for backward compatibility
		if token == "" {
			authHeader := r.Header.Get("Authorization")
			if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				token = authHeader[7:]
			}
		}

		if token == "" {
			utils.SendError(w, http.StatusUnauthorized, "missing authentication token", nil)
			return
		}

		// Validate JWT token
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
