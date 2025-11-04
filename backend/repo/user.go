package repo

import (
	"github.com/jmoiron/sqlx"
)

type User struct {
	ID     string `json:"id" db:"id"`
	Name   string `json:"name" db:"username"`
	ApiKey string `json:"api_key" db:"api_key"`
}

type UserRepo interface {
	Create(User) (*User, error)
	FindUser(ID string) (*User, error)
	FindUserByAPIKey(apiKey string) (*User, error)
}

type userRepo struct {
	db *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) UserRepo {
	return &userRepo{
		db: db,
	}
}

func (r *userRepo) Create(newUser User) (*User, error) {
	query := `INSERT INTO users 
				(id, username, api_key) 
				VALUES ($1, $2, $3)`
	_, err := r.db.Exec(query, newUser.ID, newUser.Name, newUser.ApiKey)
	if err != nil {
		return nil, err
	}
	return &newUser, nil
}

func (u *userRepo) FindUser(ID string) (*User, error) {
	var user User
	err := u.db.QueryRow("SELECT id, api_key FROM users WHERE id = $1", ID).Scan(&user.ID, &user.ApiKey)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (u *userRepo) FindUserByAPIKey(apiKey string) (*User, error) {
	var user User
	err := u.db.QueryRow("SELECT id, username, api_key FROM users WHERE api_key = $1", apiKey).Scan(&user.ID, &user.Name, &user.ApiKey)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
