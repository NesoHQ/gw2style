package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/NesoHQ/gw2style/config"
	"github.com/NesoHQ/gw2style/repo"
)

type DiscordEmbed struct {
	Title       string                 `json:"title"`
	Description string                 `json:"description"`
	Color       int                    `json:"color"`
	Fields      []DiscordEmbedField    `json:"fields,omitempty"`
	Image       *DiscordEmbedImage     `json:"image,omitempty"`
	Thumbnail   *DiscordEmbedThumbnail `json:"thumbnail,omitempty"`
	Footer      *DiscordEmbedFooter    `json:"footer,omitempty"`
}

type DiscordEmbedField struct {
	Name   string `json:"name"`
	Value  string `json:"value"`
	Inline bool   `json:"inline"`
}

type DiscordEmbedImage struct {
	URL string `json:"url"`
}

type DiscordEmbedThumbnail struct {
	URL string `json:"url"`
}

type DiscordEmbedFooter struct {
	Text string `json:"text"`
}

type DiscordWebhookPayload struct {
	Content string         `json:"content,omitempty"`
	Embeds  []DiscordEmbed `json:"embeds,omitempty"`
}

// SendPostToDiscord sends a new post notification to Discord
func (h *Handlers) SendPostToDiscord(post *repo.Post) error {
	cfg := config.GetConfig()

	// Build tags string
	tagsStr := "None"
	if post.Tags != nil {
		if tagsBytes, err := json.Marshal(post.Tags); err == nil {
			var tags []string
			if err := json.Unmarshal(tagsBytes, &tags); err == nil && len(tags) > 0 {
				tagsStr = ""
				for i, tag := range tags {
					if i > 0 {
						tagsStr += ", "
					}
					tagsStr += tag
				}
			}
		}
	}

	// Create embed
	embed := DiscordEmbed{
		Title:       "🆕 New Post Submitted",
		Description: fmt.Sprintf("**%s**\n\n%s", post.Title, post.Description),
		Color:       3447003, // Blue color
		Fields: []DiscordEmbedField{
			{
				Name:   "Author",
				Value:  post.AuthorName,
				Inline: true,
			},
			{
				Name:   "Post ID",
				Value:  post.ID,
				Inline: true,
			},
			{
				Name:   "Tags",
				Value:  tagsStr,
				Inline: false,
			},
		},
		Footer: &DiscordEmbedFooter{
			Text: "React with ✅ to approve or ❌ to reject",
		},
	}

	// Add thumbnail if available
	if post.Thumbnail != "" {
		embed.Thumbnail = &DiscordEmbedThumbnail{
			URL: post.Thumbnail,
		}
	}

	payload := DiscordWebhookPayload{
		Content: fmt.Sprintf("📋 **New post awaiting moderation** (ID: %s)", post.ID),
		Embeds:  []DiscordEmbed{embed},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("error marshaling webhook payload: %w", err)
	}

	resp, err := http.Post(cfg.DiscordWebhookURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("error sending webhook: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		return fmt.Errorf("discord webhook returned status %d", resp.StatusCode)
	}

	return nil
}
