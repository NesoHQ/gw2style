package repo

import (
	"context"
	"database/sql"
	"fmt"
)

type Report struct {
	ID               int    `json:"id"`
	PostID           int    `json:"post_id"`
	ReporterUsername string `json:"reporter_username"`
	Reason           string `json:"reason"`
	Description      string `json:"description"`
	Status           string `json:"status"`
	CreatedAt        string `json:"created_at"`
	ResolvedAt       string `json:"resolved_at,omitempty"`
	ResolvedBy       string `json:"resolved_by,omitempty"`
}

type ModerationLog struct {
	ID                 int    `json:"id"`
	PostID             int    `json:"post_id"`
	Action             string `json:"action"`
	ModeratorUsername  string `json:"moderator_username"`
	ModeratorDiscordID string `json:"moderator_discord_id"`
	Reason             string `json:"reason"`
	CreatedAt          string `json:"created_at"`
}

type ModerationRepository struct {
	db *sql.DB
}

func NewModerationRepository(db *sql.DB) *ModerationRepository {
	return &ModerationRepository{db: db}
}

// PublishPost sets a post as published and logs the action
func (r *ModerationRepository) PublishPost(ctx context.Context, postID int, moderatorUsername, moderatorDiscordID string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback()

	// Update post to published
	_, err = tx.ExecContext(ctx, "UPDATE posts SET published = true WHERE id = $1", postID)
	if err != nil {
		return fmt.Errorf("error publishing post: %w", err)
	}

	// Log the action
	_, err = tx.ExecContext(ctx,
		`INSERT INTO moderation_log (post_id, action, moderator_username, moderator_discord_id, reason) 
		 VALUES ($1, $2, $3, $4, $5)`,
		postID, "published", moderatorUsername, moderatorDiscordID, "Approved by moderator")
	if err != nil {
		return fmt.Errorf("error logging moderation action: %w", err)
	}

	return tx.Commit()
}

// RejectPost sets a post as unpublished and logs the action
func (r *ModerationRepository) RejectPost(ctx context.Context, postID int, moderatorUsername, moderatorDiscordID, reason string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback()

	// Update post to unpublished
	_, err = tx.ExecContext(ctx, "UPDATE posts SET published = false WHERE id = $1", postID)
	if err != nil {
		return fmt.Errorf("error rejecting post: %w", err)
	}

	// Log the action
	_, err = tx.ExecContext(ctx,
		`INSERT INTO moderation_log (post_id, action, moderator_username, moderator_discord_id, reason) 
		 VALUES ($1, $2, $3, $4, $5)`,
		postID, "rejected", moderatorUsername, moderatorDiscordID, reason)
	if err != nil {
		return fmt.Errorf("error logging moderation action: %w", err)
	}

	return tx.Commit()
}

// CreateReport creates a new user report
func (r *ModerationRepository) CreateReport(ctx context.Context, report Report) error {
	query := `
		INSERT INTO reports (post_id, reporter_username, reason, description)
		VALUES ($1, $2, $3, $4)`

	_, err := r.db.ExecContext(ctx, query, report.PostID, report.ReporterUsername, report.Reason, report.Description)
	if err != nil {
		return fmt.Errorf("error creating report: %w", err)
	}

	return nil
}

// GetPendingReports retrieves all pending reports
func (r *ModerationRepository) GetPendingReports(ctx context.Context) ([]Report, error) {
	query := `
		SELECT id, post_id, reporter_username, reason, 
		       COALESCE(description, '') as description, status,
		       to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
		FROM reports
		WHERE status = 'pending'
		ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reports []Report
	for rows.Next() {
		var report Report
		err := rows.Scan(
			&report.ID,
			&report.PostID,
			&report.ReporterUsername,
			&report.Reason,
			&report.Description,
			&report.Status,
			&report.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		reports = append(reports, report)
	}

	return reports, rows.Err()
}

// GetModerationLogs retrieves recent moderation actions
func (r *ModerationRepository) GetModerationLogs(ctx context.Context, limit int) ([]ModerationLog, error) {
	query := `
		SELECT id, post_id, action, moderator_username, 
		       COALESCE(moderator_discord_id, '') as moderator_discord_id,
		       COALESCE(reason, '') as reason,
		       to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
		FROM moderation_log
		ORDER BY created_at DESC
		LIMIT $1`

	rows, err := r.db.QueryContext(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []ModerationLog
	for rows.Next() {
		var log ModerationLog
		err := rows.Scan(
			&log.ID,
			&log.PostID,
			&log.Action,
			&log.ModeratorUsername,
			&log.ModeratorDiscordID,
			&log.Reason,
			&log.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		logs = append(logs, log)
	}

	return logs, rows.Err()
}
