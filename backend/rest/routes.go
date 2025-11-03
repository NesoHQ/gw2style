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

	mux.Handle(
		"GET /api/v1/posts/search",
		manager.With(
			http.HandlerFunc(server.handlers.SearchPostsHandler),
		),
	)

	mux.Handle(
		"GET /api/v1/posts/popular",
		manager.With(
			http.HandlerFunc(server.handlers.GetPopularPostsHandler),
		),
	)

	// Protected routes that require JWT auth
	mux.Handle(
		"GET /api/v1/user/apikey",
		manager.With(
			http.HandlerFunc(server.handlers.GetUserAPIKeyHandler),
			server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"POST /api/v1/posts/create",
		manager.With(
			http.HandlerFunc(server.handlers.CreatePostHandler),
			server.middlewares.AuthenticateJWT,
		),
	)
}
