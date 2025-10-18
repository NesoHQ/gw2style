package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type ApiKeyInfo struct {
	Permissions []string `json:"permissions"`
}

func HasRequiredPermissions(apiKey string) (bool, error) {
	url := "https://api.guildwars2.com/v2/tokeninfo"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return false, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return false, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return false, fmt.Errorf("api returned status %d: %s", resp.StatusCode, string(body))
	}

	var apiKeyInfo ApiKeyInfo
	if err := json.Unmarshal(body, &apiKeyInfo); err != nil {
		return false, fmt.Errorf("failed to parse API response: %w", err)
	}

	fmt.Println(apiKeyInfo) // check what permissions the key has

	required := []string{"account", "characters", "builds"}
	set := make(map[string]struct{}, len(apiKeyInfo.Permissions))
	for _, v := range apiKeyInfo.Permissions {
		set[v] = struct{}{}
	}

	for _, v := range required {
		if _, ok := set[v]; !ok {
			fmt.Println("Missing:", v)
			return false, fmt.Errorf("missing required permission: %s", v)
		}
	}

	return true, nil
}
