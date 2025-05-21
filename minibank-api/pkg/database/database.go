package database

import (
	"database/sql"
	"fmt"

	"github.com/kiriksik/minibank/minibank-api/config"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func Init() error {
	db, err := sql.Open("postgres", config.GetDBURL())

	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	if err = db.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	DB = db

	return nil
}
