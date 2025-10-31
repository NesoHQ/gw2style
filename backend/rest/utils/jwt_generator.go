package utils

import (
	"context"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const UserContextKey contextKey = "user"

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Claims struct {
	UserID   string `json:"sub"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// GetUserFromContext extracts the user from the context
func GetUserFromContext(ctx context.Context) (*User, error) {
	user, ok := ctx.Value(UserContextKey).(*User)
	if !ok {
		return nil, fmt.Errorf("no user found in context")
	}
	return user, nil
}

// ValidateJWT validates the JWT token and returns the claims
func ValidateJWT(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
		if t.Method.Alg() != jwt.SigningMethodHS256.Alg() {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte("secret"), nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
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
