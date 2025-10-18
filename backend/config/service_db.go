package config

type DB struct {
	DbHost                 string `mapstructure:"DB_HOST"                       validate:"required"`
	DbPort                 int    `mapstructure:"DB_PORT"                       validate:"required"`
	DbName                 string `mapstructure:"DB_NAME"                       validate:"required"`
	DbUser                 string `mapstructure:"DB_USER"                       validate:"required"`
	DbPassword             string `mapstructure:"DB_PASSWORD"                   validate:"required"`
	DbMaxIdleTimeInMinutes int    `mapstructure:"DB_MAX_IDLE_TIME_IN_MINUTES"   validate:"required"`
	DbMaxOpenConns         int    `mapstructure:"DB_MAX_OPEN_CONNS"             validate:"required"`
	DbMaxIdleConns         int    `mapstructure:"DB_MAX_IDLE_CONNS"             validate:"required"`
	DbEnableSSLMode        bool   `mapstructure:"DB_ENABLE_SSL_MODE"`
}

func (db *DB) User() string              { return db.DbUser }
func (db *DB) Password() string          { return db.DbPassword }
func (db *DB) Host() string              { return db.DbHost }
func (db *DB) Port() int                 { return db.DbPort }
func (db *DB) Name() string              { return db.DbName }
func (db *DB) EnableSSLMode() bool       { return db.DbEnableSSLMode }
func (db *DB) MaxIdleTimeInMinutes() int { return db.DbMaxIdleTimeInMinutes }
func (db *DB) MaxOpenConns() int         { return db.DbMaxOpenConns }
func (db *DB) MaxIdleConns() int         { return db.DbMaxIdleConns }
