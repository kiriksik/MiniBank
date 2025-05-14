package repository

import (
	"github.com/kiriksik/minibank/internal/model"
	"github.com/kiriksik/minibank/pkg/database"
)

func CreateUser(username, passwordHash string) error {
	query := `INSERT INTO users (username, password_hash) VALUES ($1, $2)`
	_, err := database.DB.Exec(query, username, passwordHash)
	return err
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
