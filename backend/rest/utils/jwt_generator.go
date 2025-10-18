package utils

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func GenerateJWT(account User) (string, error) {
	token, err := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"sub": account.ID,
			"username": account.Name,
		},
	).SignedString([]byte("secret"))
	if err != nil {
		return "", fmt.Errorf("failed to generate jwt: %w", err)
	}

	return token, nil
}
