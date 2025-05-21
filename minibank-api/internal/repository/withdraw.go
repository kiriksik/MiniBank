package repository

import (
	"database/sql"
	"errors"

	"github.com/kiriksik/minibank/minibank-api/pkg/database"
)

func Withdraw(userID int, amount float64) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var balance float64
	err = tx.QueryRow("SELECT amount FROM balances WHERE user_id = $1 FOR UPDATE", userID).Scan(&balance)
	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("user has no balance")
		}
		return err
	}

	if balance < amount {
		return errors.New("not enough money")
	}

	_, err = tx.Exec("UPDATE balances SET amount = amount - $1 WHERE user_id = $2", amount, userID)
	if err != nil {
		return err
	}

	_, err = tx.Exec(`INSERT INTO transactions (from_user_id, to_user_id, amount) VALUES ($1, NULL, $2)`, userID, amount)
	if err != nil {
		return err
	}

	return tx.Commit()
}
