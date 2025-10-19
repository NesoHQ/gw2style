package rest

import (
	"net/http"

	"github.com/NesoHQ/gw2style/rest/middlewares"
)

func (server *Server) initRoutes(mux *http.ServeMux, manager *middlewares.Manager) {
	mux.Handle(
		"POST /api/v1/login",
		manager.With(
			http.HandlerFunc(server.handlers.LoginHandler),
			// server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /api/v1/posts",
		manager.With(
			http.HandlerFunc(server.handlers.GetPostsHandler),
		),
	)
}
