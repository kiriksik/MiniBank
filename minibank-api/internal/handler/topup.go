package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiriksik/minibank/minibank-api/internal/model"
	"github.com/kiriksik/minibank/minibank-api/internal/repository"
)

func TopUp(c *gin.Context) {
	var req model.TopUpRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid amount"})
		return
	}

	userID := c.GetInt("user_id")

	err := repository.TopUp(userID, req.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to top up"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "successfully added balance"})
}
