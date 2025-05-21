package model

import "time"

type Transaction struct {
	ID         int       `json:"id"`
	FromUserID *int      `json:"from_user_id,omitempty"`
	ToUserID   *int      `json:"to_user_id,omitempty"`
	Amount     float64   `json:"amount"`
	CreatedAt  time.Time `json:"created_at"`
}
