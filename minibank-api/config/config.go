package config

import (
	"fmt"
	"os"
)

func GetDBURL() string {
	host := os.Getenv("GOOSE_DBSTRING")
	if host == "" {
		host = "postgres://user:test@localhost:5433/minibank"
	}
	return fmt.Sprintf("%s?sslmode=disable", host)
}
