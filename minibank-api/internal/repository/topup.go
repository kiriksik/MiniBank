package repository

import "github.com/kiriksik/minibank/minibank-api/pkg/database"

func TopUp(userID int, amount float64) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, err = tx.Exec("UPDATE balances SET amount = amount + $1 WHERE user_id = $2", amount, userID)
	if err != nil {
		return err
	}

	_, err = tx.Exec("INSERT INTO transactions (from_user_id, to_user_id, amount) VALUES (NULL, $1, $2)", userID, amount)
	if err != nil {
		return err
	}

	return tx.Commit()
}
