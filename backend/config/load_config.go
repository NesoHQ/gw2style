package config

import (
	"log/slog"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

func loadConfig() error {
	exit := func(err error) {
		slog.Error(err.Error())
		os.Exit(1)
	}

	err := godotenv.Load()
	if err != nil {
		slog.Warn(".env not found,that's okay!")
	}

	viper.AutomaticEnv()

	config = &Config{
		Version:     viper.GetString("VERSION"),
		Mode:        Mode(viper.GetString("MODE")),
		ServiceName: viper.GetString("SERVICE_NAME"),
		HttpPort:    viper.GetInt("HTTP_PORT"),
		// MigrationSource: viper.GetString("MIGRATION_SOURCE"),
		JwtSecret:       viper.GetString("JWT_SECRET"),
		DB: &DB{
			DbHost:                 viper.GetString("DB_HOST"),
			DbPort:                 viper.GetInt("DB_PORT"),
			DbName:                 viper.GetString("DB_NAME"),
			DbUser:                 viper.GetString("DB_USER"),
			DbPassword:             viper.GetString("DB_PASSWORD"),
			DbMaxIdleTimeInMinutes: viper.GetInt("DB_MAX_IDLE_TIME_IN_MINUTES"),
			DbMaxOpenConns:         viper.GetInt("DB_MAX_OPEN_CONNS"),
			DbMaxIdleConns:         viper.GetInt("DB_MAX_IDLE_CONNS"),
			DbEnableSSLMode:        viper.GetBool("DB_ENABLE_SSL_MODE"),
		},
	}

	v := validator.New()
	if err = v.Struct(config); err != nil {
		exit(err)
	}

	return nil
}
