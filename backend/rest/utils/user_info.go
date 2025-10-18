package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func GetUserInfo(apiKey string) (User, error) {
	url := "https://api.guildwars2.com/v2/account"
	httpReq, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return User{}, fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(httpReq)
	if err != nil {
		return User{}, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var user User
	if err := json.Unmarshal(body, &user); err != nil {
		return User{}, fmt.Errorf("failed to parse API response: %w", err)
	}

	return user, nil
}
