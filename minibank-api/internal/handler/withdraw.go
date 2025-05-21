package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiriksik/minibank/minibank-api/internal/repository"
)

type WithdrawRequest struct {
	Amount float64 `json:"amount"`
}

func Withdraw(c *gin.Context) {
	var req WithdrawRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid amount"})
		return
	}

	userID := c.GetInt("user_id")

	err := repository.Withdraw(userID, req.Amount)
	if err != nil {
		if err.Error() == "not enough money" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "not enough funds"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "withdraw failed"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "withdraw successful"})
}
