package cmd

import (
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/NesoHQ/gw2style/bot"
	"github.com/NesoHQ/gw2style/config"
	"github.com/NesoHQ/gw2style/db"
	"github.com/NesoHQ/gw2style/logger"
	"github.com/NesoHQ/gw2style/repo"
	"github.com/NesoHQ/gw2style/rest"
	"github.com/NesoHQ/gw2style/rest/handlers"
	"github.com/NesoHQ/gw2style/rest/middlewares"
)

func Serve() {
	cnf := config.GetConfig()

	DB, err := db.GetDbConnection(cnf.DB)

	if err != nil {
		slog.Error("Failed to connect to database:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		fmt.Println(err)
		os.Exit(1)
	}
	defer db.CloseDB(DB)

	err = db.MigrateDB(DB, cnf.MigrationSource)
	if err != nil {
		slog.Error("Failed to migrate database:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		fmt.Println(err)
		os.Exit(1)
	}

	userRepo := repo.NewUserRepo(DB)

	handlers := handlers.NewHandler(cnf, DB, userRepo)
	middlewares := middlewares.NewMiddleware(cnf)

	server, err := rest.NewServer(middlewares, cnf, handlers)
	if err != nil {
		slog.Error("Failed to create the server:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		fmt.Println(err)
		os.Exit(1)
	}

	// Initialize Discord bot
	discordBot, err := bot.NewBot(cnf)
	if err != nil {
		slog.Error("Failed to create Discord bot:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		fmt.Println(err)
		os.Exit(1)
	}

	// Start Discord bot
	err = discordBot.Start()
	if err != nil {
		slog.Error("Failed to start Discord bot:", logger.Extra(map[string]any{
			"error": err.Error(),
		}))
		fmt.Println(err)
		os.Exit(1)
	}
	defer discordBot.Stop()

	// Start HTTP server
	server.Start()

	// Wait for interrupt signal to gracefully shutdown
	slog.Info("Server and Discord bot are running. Press CTRL+C to exit.")
	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt)
	<-sc

	slog.Info("Shutting down gracefully...")
}
