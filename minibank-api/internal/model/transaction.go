package model

import "time"

type Transaction struct {
	ID           int       `json:"id"`
	FromUserID   *int      `json:"from_user_id"`  // если могут быть NULL
	FromUsername *string   `json:"from_username"` // может быть NULL
	ToUserID     *int      `json:"to_user_id"`
	ToUsername   *string   `json:"to_username"`
	Amount       float64   `json:"amount"`
	CreatedAt    time.Time `json:"created_at"`
}
