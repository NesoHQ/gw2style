package middlewares

import (
	"net/http"

	"github.com/rs/cors"
)

func EnableCors(mux *http.ServeMux) http.Handler {
	c := cors.New(cors.Options{
		AllowOriginFunc: func(origin string) bool {
			// Allow all origins for now
			return true
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Cookie"},
		ExposedHeaders:   []string{"Set-Cookie"},
		AllowCredentials: true,
		Debug:            false,
	})

	return c.Handler(mux)
}
