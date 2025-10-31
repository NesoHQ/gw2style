package repo

import (
	"database/sql"

	"github.com/jmoiron/sqlx"
)

type User struct {
	ID   string `json:"id" db:"id"`
	Name string `json:"name" db:"username"`
	ApiKey string `json:"apikey" db:"apikey"`
}

type UserRepo interface {
	Create(User) (*User, error)
	FindUser(ID string) (*User, error)
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
				(id, username, api_key_privet) 
				VALUES ($1, $2, $3)`
	_, err := r.db.Exec(query, newUser.ID, newUser.Name, newUser.ApiKey)
	if err != nil {
		return nil, err
	}
	return &newUser, nil
}

func (r *userRepo) FindUser(ID string) (*User, error) {
	var user User
	query := `SELECT id, username FROM users WHERE id = $1`
	err := r.db.Get(&user, query, ID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}
