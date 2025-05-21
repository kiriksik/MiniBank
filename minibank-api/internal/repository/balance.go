package repository

import (
	"database/sql"
	"errors"

	"github.com/kiriksik/minibank/minibank-api/pkg/database"
)

func GetBalance(userID int) (float64, error) {
	var amount float64
	err := database.DB.QueryRow("SELECT amount FROM balances WHERE user_id = $1", userID).Scan(&amount)
	if errors.Is(err, sql.ErrNoRows) {
		_, err = database.DB.Exec("INSERT INTO balances (user_id, amount) VALUES ($1, 0)", userID)
		return 0, err
	}

	return amount, err
}

func Transfer(fromID, toID int, amount float64) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var senderBalance float64
	err = tx.QueryRow("SELECT amount FROM balances WHERE user_id = $1 FOR UPDATE", fromID).Scan(&senderBalance)
	if err != nil {
		return err
	}
	if senderBalance < amount {
		return errors.New("not enough money")
	}

	_, err = tx.Exec("UPDATE balances SET amount = amount - $1 WHERE user_id = $2", amount, fromID)
	if err != nil {
		return err
	}
	_, err = tx.Exec("UPDATE balances SET amount = amount + $1 WHERE user_id = $2", amount, toID)
	if err != nil {
		return err
	}
	_, err = tx.Exec("INSERT INTO transactions (from_user_id, to_user_id, amount) VALUES ($1, $2, $3)", fromID, toID, amount)
	if err != nil {
		return err
	}

	return tx.Commit()
}
