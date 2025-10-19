package handlers

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"

	"github.com/NesoHQ/gw2style/config"
	"github.com/NesoHQ/gw2style/repo"
)

type Handlers struct {
	cnf      *config.Config
	DB       *sqlx.DB
	repoUser repo.UserRepo
}

func NewHandler(cnf *config.Config, db *sqlx.DB, userRepo repo.UserRepo) *Handlers {
	return &Handlers{
		cnf: cnf,
		DB:  db,
		repoUser: userRepo,
	}
}
