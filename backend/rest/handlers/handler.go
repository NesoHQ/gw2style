package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"

	"github.com/NesoHQ/gw2style/config"
	"github.com/NesoHQ/gw2style/repo"
)

type Handlers struct {
	cnf      *config.Config
	DB       *sqlx.DB
	repoUser repo.UserRepo
	postRepo *repo.PostRepository
}

func NewHandler(cnf *config.Config, db *sqlx.DB, userRepo repo.UserRepo) *Handlers {
	return &Handlers{
		cnf:      cnf,
		DB:       db,
		repoUser: userRepo,
		postRepo: repo.NewPostRepository(db.DB),
	}
}

// sendError sends an error response with the given status code and message
func (h *Handlers) sendError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": false,
		"error":   message,
	})
}
