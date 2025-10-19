package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func GenerateJWT(user User) (string, error) {
	expirationTime := time.Now().Add(7 * 24 * time.Hour).Unix()

	claims := jwt.MapClaims{
		"sub":      user.ID,
		"username": user.Name,
		"exp":      expirationTime,
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte("secret"))
	if err != nil {
		return "", fmt.Errorf("failed to generate jwt: %w", err)
	}

	return token, nil
}
