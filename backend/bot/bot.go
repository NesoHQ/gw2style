package bot

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"github.com/NesoHQ/gw2style/config"
	"github.com/bwmarrin/discordgo"
)

type Bot struct {
	session *discordgo.Session
	config  *config.Config
	apiURL  string
}

type PublishRequest struct {
	ModeratorUsername  string `json:"moderator_username"`
	ModeratorDiscordID string `json:"moderator_discord_id"`
}

type RejectRequest struct {
	ModeratorUsername  string `json:"moderator_username"`
	ModeratorDiscordID string `json:"moderator_discord_id"`
	Reason             string `json:"reason"`
}

func NewBot(cfg *config.Config) (*Bot, error) {
	session, err := discordgo.New("Bot " + cfg.DiscordBotToken)
	if err != nil {
		return nil, fmt.Errorf("error creating Discord session: %w", err)
	}

	bot := &Bot{
		session: session,
		config:  cfg,
		apiURL:  fmt.Sprintf("http://localhost:%d/api/v1", cfg.HttpPort),
	}

	// Register event handlers
	session.AddHandler(bot.handleReactionAdd)

	// Set intents - need message content to read webhook messages
	session.Identify.Intents = discordgo.IntentsGuildMessageReactions |
		discordgo.IntentsGuildMessages |
		discordgo.IntentMessageContent

	return bot, nil
}

func (b *Bot) Start() error {
	err := b.session.Open()
	if err != nil {
		return fmt.Errorf("error opening Discord connection: %w", err)
	}

	slog.Info("Discord bot is now running")
	return nil
}

func (b *Bot) Stop() error {
	return b.session.Close()
}

// handleReactionAdd processes emoji reactions on moderation messages
func (b *Bot) handleReactionAdd(s *discordgo.Session, r *discordgo.MessageReactionAdd) {
	// Ignore bot's own reactions
	if r.UserID == s.State.User.ID {
		return
	}

	// Only process reactions in the moderation channel
	if r.ChannelID != b.config.DiscordModChannel {
		return
	}

	// Get the message to extract post ID
	msg, err := s.ChannelMessage(r.ChannelID, r.MessageID)
	if err != nil {
		slog.Error("Error fetching message", "error", err)
		return
	}

	// Extract post ID from message content or embeds
	postID := extractPostID(msg)
	if postID == "" {
		slog.Warn("Could not extract post ID from message", "content", msg.Content, "embedCount", len(msg.Embeds))
		return
	}

	// Get user info
	user, err := s.User(r.UserID)
	if err != nil {
		slog.Error("Error fetching user", "error", err)
		return
	}

	// Process reaction
	switch r.Emoji.Name {
	case "✅":
		b.handleApproval(postID, user, msg)
	case "❌":
		b.handleRejection(postID, user, msg)
	default:
		// Ignore other reactions
		return
	}
}

func (b *Bot) handleApproval(postID string, user *discordgo.User, msg *discordgo.Message) {
	slog.Info("Processing approval", "postID", postID, "moderator", user.Username)

	// Call backend API to publish post
	reqBody := PublishRequest{
		ModeratorUsername:  user.Username,
		ModeratorDiscordID: user.ID,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		slog.Error("Error marshaling request", "error", err)
		return
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/admin/posts/%s/publish", b.apiURL, postID), bytes.NewBuffer(jsonData))
	if err != nil {
		slog.Error("Error creating request", "error", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bot "+b.config.DiscordBotToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		slog.Error("Error calling API", "error", err)
		b.sendErrorReply(msg.ChannelID, msg.ID, "Failed to approve post")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		slog.Error("API returned error", "status", resp.StatusCode)
		b.sendErrorReply(msg.ChannelID, msg.ID, fmt.Sprintf("Failed to approve post (status: %d)", resp.StatusCode))
		return
	}

	// Send success message
	successMsg := fmt.Sprintf("✅ Post #%s has been **APPROVED** by %s and published!", postID, user.Username)
	b.session.ChannelMessageSend(msg.ChannelID, successMsg)

	// Announce to public channel if webhook is configured
	if b.config.DiscordPublicWebhook != "" {
		slog.Info("Announcing post to public channel", "postID", postID, "webhook", b.config.DiscordPublicWebhook[:20]+"...")
		b.announceNewPost(postID, msg)
	} else {
		slog.Warn("Public webhook not configured, skipping announcement")
	}

	// Delete the moderation message
	err = b.session.ChannelMessageDelete(msg.ChannelID, msg.ID)
	if err != nil {
		slog.Error("Error deleting moderation message", "error", err)
	}

	slog.Info("Post approved successfully", "postID", postID)
}

func (b *Bot) handleRejection(postID string, user *discordgo.User, msg *discordgo.Message) {
	slog.Info("Processing rejection", "postID", postID, "moderator", user.Username)

	// Call backend API to reject post
	reqBody := RejectRequest{
		ModeratorUsername:  user.Username,
		ModeratorDiscordID: user.ID,
		Reason:             "Rejected by moderator",
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		slog.Error("Error marshaling request", "error", err)
		return
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/admin/posts/%s/reject", b.apiURL, postID), bytes.NewBuffer(jsonData))
	if err != nil {
		slog.Error("Error creating request", "error", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bot "+b.config.DiscordBotToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		slog.Error("Error calling API", "error", err)
		b.sendErrorReply(msg.ChannelID, msg.ID, "Failed to reject post")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		slog.Error("API returned error", "status", resp.StatusCode)
		b.sendErrorReply(msg.ChannelID, msg.ID, fmt.Sprintf("Failed to reject post (status: %d)", resp.StatusCode))
		return
	}

	// Send rejection message
	rejectMsg := fmt.Sprintf("❌ Post #%s has been **REJECTED** by %s", postID, user.Username)
	b.session.ChannelMessageSend(msg.ChannelID, rejectMsg)

	// Delete the moderation message
	err = b.session.ChannelMessageDelete(msg.ChannelID, msg.ID)
	if err != nil {
		slog.Error("Error deleting moderation message", "error", err)
	}

	slog.Info("Post rejected successfully", "postID", postID)
}

func (b *Bot) sendErrorReply(channelID, messageID, errorMsg string) {
	b.session.ChannelMessageSendReply(channelID, "⚠️ "+errorMsg, &discordgo.MessageReference{
		MessageID: messageID,
		ChannelID: channelID,
	})
}

// extractPostID extracts the post ID from the Discord message
// Tries multiple methods: content text and embed fields
func extractPostID(msg *discordgo.Message) string {
	// Method 1: Extract from content - Expected format: "📋 **New post awaiting moderation** (ID: 123)"
	if msg.Content != "" {
		idIndex := strings.Index(msg.Content, "(ID: ")
		if idIndex != -1 {
			idStart := idIndex + 5
			idEnd := strings.Index(msg.Content[idStart:], ")")
			if idEnd != -1 {
				return msg.Content[idStart : idStart+idEnd]
			}
		}
	}

	// Method 2: Extract from embed fields
	for _, embed := range msg.Embeds {
		for _, field := range embed.Fields {
			if field.Name == "Post ID" {
				return field.Value
			}
		}
	}

	return ""
}

// announceNewPost sends the approved post to the public channel
func (b *Bot) announceNewPost(postID string, originalMsg *discordgo.Message) {
	slog.Info("Starting public announcement", "postID", postID, "embedCount", len(originalMsg.Embeds))

	// Extract post details from the original embed
	var embed *discordgo.MessageEmbed
	if len(originalMsg.Embeds) > 0 {
		embed = originalMsg.Embeds[0]
	} else {
		slog.Warn("No embed found in moderation message", "postID", postID)
		return
	}

	// Create a new embed for the public announcement
	publicEmbed := &discordgo.MessageEmbed{
		Title:       "✨ New Post Published!",
		Description: embed.Description,
		Color:       5763719, // Green color
		Fields:      embed.Fields,
		Thumbnail:   embed.Thumbnail,
		Footer: &discordgo.MessageEmbedFooter{
			Text: fmt.Sprintf("View on website: https://gw2style.com/posts/%s", postID),
		},
	}

	// Send to public webhook
	payload := map[string]interface{}{
		"content": fmt.Sprintf("🎨 **New fashion post is live!** Check it out: https://gw2style.com/posts/%s", postID),
		"embeds":  []*discordgo.MessageEmbed{publicEmbed},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		slog.Error("Error marshaling public webhook payload", "error", err)
		return
	}

	slog.Info("Sending webhook to public channel", "url", b.config.DiscordPublicWebhook[:30]+"...")
	resp, err := http.Post(b.config.DiscordPublicWebhook, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		slog.Error("Error sending public webhook", "error", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		body := make([]byte, 1024)
		resp.Body.Read(body)
		slog.Error("Public webhook returned error", "status", resp.StatusCode, "body", string(body))
		return
	}

	slog.Info("Post announced to public channel successfully", "postID", postID)
}
