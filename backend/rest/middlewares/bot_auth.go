package middlewares

import (
	"net/http"
	"strings"

	"github.com/NesoHQ/gw2style/config"
	"github.com/NesoHQ/gw2style/rest/utils"
)

// AuthenticateBot validates that the request comes from the Discord bot
func (m *Middlewares) AuthenticateBot(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			utils.SendError(w, http.StatusUnauthorized, "missing authorization header", nil)
			return
		}

		// Expected format: "Bot <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bot" {
			utils.SendError(w, http.StatusUnauthorized, "invalid authorization format", nil)
			return
		}

		token := parts[1]
		cfg := config.GetConfig()

		if token != cfg.DiscordBotToken {
			utils.SendError(w, http.StatusUnauthorized, "invalid bot token", nil)
			return
		}

		next.ServeHTTP(w, r)
	})
}
