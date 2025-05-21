package repository

import (
	"database/sql"

	"github.com/kiriksik/minibank/minibank-api/internal/model"
	"github.com/kiriksik/minibank/minibank-api/pkg/database"
)

func GetTransactions(userID int, filter string, limit, offset int) ([]model.Transaction, error) {
	var rows *sql.Rows
	var err error

	query := `
		SELECT id, from_user_id, to_user_id, amount, created_at
		FROM transactions
		WHERE 
		(
			(from_user_id = $1 AND $2 IN ('', 'out')) OR
			(to_user_id = $1 AND from_user_id IS NOT NULL AND $2 IN ('', 'in')) OR
			(to_user_id = $1 AND from_user_id IS NULL AND $2 IN ('', 'topup')) OR
			(from_user_id = $1 AND to_user_id IS NULL AND $2 IN ('', 'withdraw'))
		)
		ORDER BY created_at DESC
		LIMIT $3 OFFSET $4
	`

	rows, err = database.DB.Query(query, userID, filter, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []model.Transaction
	for rows.Next() {
		var transaction model.Transaction
		err := rows.Scan(&transaction.ID, &transaction.FromUserID, &transaction.ToUserID, &transaction.Amount, &transaction.CreatedAt)
		if err != nil {
			return nil, err
		}
		transactions = append(transactions, transaction)
	}

	return transactions, nil
}
