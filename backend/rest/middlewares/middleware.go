package middlewares

import (
	"github.com/NesoHQ/gw2style/config"
)

type Middlewares struct {
	Cnf *config.Config
}

func NewMiddleware(cnf *config.Config) *Middlewares {
	return &Middlewares{
		Cnf: cnf,
	}
}
