package model

type TransferInput struct {
	ToUserID int     `json:"to_user_id" binding:"required"`
	Amount   float64 `json:"amount" binding:"required"`
}
