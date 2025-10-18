package handlers

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"

	"github.com/NesoHQ/gw2style/config"
)

type Handlers struct {
	cnf *config.Config
	DB  *sqlx.DB
}

func NewHandler(cnf *config.Config, db *sqlx.DB) *Handlers {
	return &Handlers{
		cnf: cnf,
		DB:  db,
	}
}
