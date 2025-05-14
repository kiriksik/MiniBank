package config

import (
	"fmt"
	"os"
)

func GetDBURL() string {
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "localhost"
	}
	return fmt.Sprintf("postgres://user:test@%s:5432/minibank?sslmode=disable", host)
}
