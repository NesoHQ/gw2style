package cmd

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/NesoHQ/gw2style/config"
	"github.com/NesoHQ/gw2style/db"
	"github.com/NesoHQ/gw2style/logger"
	"github.com/NesoHQ/gw2style/rest"
	"github.com/NesoHQ/gw2style/rest/handlers"
	"github.com/NesoHQ/gw2style/rest/middlewares"
)

func Serve() {
	cnf := config.GetConfig()

	DB, err := db.GetDbConnection(cnf.DB)
	fmt.Println("DB is Connected")
	if err != nil {
		slog.Error("Failed to connect to database:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		fmt.Println(err)
		os.Exit(1)
	}
	defer db.CloseDB(DB)

	handlers := handlers.NewHandler(cnf, DB)
	middlewares := middlewares.NewMiddleware(cnf)

	server, err := rest.NewServer(middlewares, cnf, handlers)
	if err != nil {
		slog.Error("Failed to create the server:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		fmt.Println(err)
		os.Exit(1)
	}

	server.Start()
	server.Wg.Wait()

	fmt.Println(err)
	os.Exit(1)
}
