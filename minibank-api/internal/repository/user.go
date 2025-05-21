package repository

import (
	"github.com/kiriksik/minibank/minibank-api/internal/model"
	"github.com/kiriksik/minibank/minibank-api/pkg/database"
)

func CreateUser(username, passwordHash string) error {
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	var userID int
	err = tx.QueryRow("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id", username, passwordHash).Scan(&userID)
	if err != nil {
		return err
	}

	_, err = tx.Exec("INSERT INTO balances (user_id, amount) VALUES ($1, 0)", userID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func GetUserByUsername(username string) (*model.User, error) {
	query := `SELECT id, username, password_hash, created_at FROM users WHERE username = $1`
	row := database.DB.QueryRow(query, username)
	u := &model.User{}

	err := row.Scan(&u.ID, &u.Username, &u.PasswordHash, &u.CreatedAt)
	if err != nil {
		return nil, err
	}

	return u, nil
}
