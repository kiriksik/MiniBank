package model

type TransferInput struct {
	ToUserID int     `json:"to_user_ud"`
	Amount   float64 `json:"amount"`
}
