package repository

import (
	"database/sql"

	"github.com/kiriksik/minibank/minibank-api/internal/model"
	"github.com/kiriksik/minibank/minibank-api/pkg/database"
)

func GetSummary(userID int) (model.Summary, error) {
	var summary model.Summary

	err := database.DB.QueryRow("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE to_user_id = $1 AND from_user_id IS NOT NULL",
		userID).Scan(&summary.TotalReceived)
	if err != nil && err != sql.ErrNoRows {
		return summary, err
	}

	err = database.DB.QueryRow("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE from_user_id = $1 AND to_user_id IS NOT NULL",
		userID).Scan(&summary.TotalSent)
	if err != nil && err != sql.ErrNoRows {
		return summary, err
	}

	err = database.DB.QueryRow("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE to_user_id = $1 AND from_user_id IS NULL",
		userID).Scan(&summary.TotalTopUp)
	if err != nil && err != sql.ErrNoRows {
		return summary, err
	}

	err = database.DB.QueryRow("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE from_user_id = $1 AND to_user_id IS NULL",
		userID).Scan(&summary.TotalWithdraw)
	if err != nil && err != sql.ErrNoRows {
		return summary, err
	}

	return summary, nil
}
