package model

type TransferInput struct {
	ToUser string  `json:"to_username" binding:"required"`
	Amount float64 `json:"amount" binding:"required"`
}
