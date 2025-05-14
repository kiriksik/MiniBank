package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiriksik/minibank/internal/repository"
)

func GetBalance(ctx *gin.Context) {
	userID := ctx.GetInt("user_id")

	amount, err := repository.GetBalance(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch balance"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"balance": amount})
}
