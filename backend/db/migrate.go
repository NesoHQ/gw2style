package db

import (
	"log/slog"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	migrate "github.com/rubenv/sql-migrate"
)

func MigrateDB(db *sqlx.DB, dir string) error {
	migrations := &migrate.FileMigrationSource{
		Dir: dir,
	}

	n, err := migrate.Exec(db.DB, "postgres", migrations, migrate.Up)
	if err != nil {
		return err
	}

	if n > 0 {
		slog.Info("Successfully applied migrations", "count", n)
	} else {
		slog.Info("No new migrations to apply")
	}

	return nil
}
