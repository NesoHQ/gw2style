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

	mux.Handle(
		"GET /api/v1/posts/{id}",
		manager.With(
			http.HandlerFunc(server.handlers.GetPostByIDHandler),
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

	// Like endpoints - require authentication
	mux.Handle(
		"POST /api/v1/posts/{id}/like",
		manager.With(
			http.HandlerFunc(server.handlers.LikePost),
			server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"DELETE /api/v1/posts/{id}/like",
		manager.With(
			http.HandlerFunc(server.handlers.UnlikePost),
			server.middlewares.AuthenticateJWT,
		),
	)

	mux.Handle(
		"GET /api/v1/posts/{id}/like",
		manager.With(
			http.HandlerFunc(server.handlers.GetLikeStatus),
			server.middlewares.AuthenticateJWT,
		),
	)

	// Get all liked posts for a user (for localStorage sync)
	mux.Handle(
		"GET /api/v1/user/liked-posts",
		manager.With(
			http.HandlerFunc(server.handlers.GetUserLikedPosts),
			server.middlewares.AuthenticateJWT,
		),
	)
}
