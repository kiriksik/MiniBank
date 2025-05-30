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
		SELECT 
			t.id, 
			t.from_user_id, 
			fu.username AS from_username,
			t.to_user_id, 
			tu.username AS to_username,
			t.amount, 
			t.created_at
		FROM transactions t
		LEFT JOIN users fu ON t.from_user_id = fu.id
		LEFT JOIN users tu ON t.to_user_id = tu.id
		WHERE 
			(
				(t.from_user_id = $1 AND $2 IN ('', 'out')) OR
				(t.to_user_id = $1 AND t.from_user_id IS NOT NULL AND $2 IN ('', 'in')) OR
				(t.to_user_id = $1 AND t.from_user_id IS NULL AND $2 IN ('', 'topup')) OR
				(t.from_user_id = $1 AND t.to_user_id IS NULL AND $2 IN ('', 'withdraw'))
			)
		ORDER BY t.created_at DESC
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
		err := rows.Scan(
			&transaction.ID,
			&transaction.FromUserID,
			&transaction.FromUsername,
			&transaction.ToUserID,
			&transaction.ToUsername,
			&transaction.Amount,
			&transaction.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		transactions = append(transactions, transaction)
	}

	return transactions, nil
}
