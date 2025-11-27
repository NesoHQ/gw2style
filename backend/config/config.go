package config

import (
	"sync"
)

var cnfOnce = sync.Once{}

type Mode string

const (
	DebugMode   = Mode("debug")
	ReleaseMode = Mode("release")
)

type Config struct {
	Version     string `mapstructure:"VERSION"                           validate:"required"`
	Mode        Mode   `mapstructure:"MODE"                              validate:"required"`
	ServiceName string `mapstructure:"SERVICE_NAME"                      validate:"required"`
	HttpPort    int    `mapstructure:"HTTP_PORT"                         validate:"required"`
	MigrationSource   string `mapstructure:"MIGRATION_SOURCE"                  validate:"required"`
	JwtSecret         string `mapstructure:"JWT_SECRET"               validate:"required"`
	DiscordBotToken   string `mapstructure:"DISCORD_BOT_TOKEN"        validate:"required"`
	DiscordWebhookURL string `mapstructure:"DISCORD_WEBHOOK_URL"      validate:"required"`
	DiscordModChannel string `mapstructure:"DISCORD_MOD_CHANNEL_ID"   validate:"required"`
	DB                DBConfig
}

var config *Config

func GetConfig() *Config {
	cnfOnce.Do(func() {
		loadConfig()
	})

	return config
}
