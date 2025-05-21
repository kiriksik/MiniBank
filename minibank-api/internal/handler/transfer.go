package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiriksik/minibank/minibank-api/internal/model"
	"github.com/kiriksik/minibank/minibank-api/internal/repository"
)

func Transfer(ctx *gin.Context) {
	var input model.TransferInput
	if err := ctx.ShouldBindJSON(&input); err != nil || input.Amount <= 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	fromID := ctx.GetInt("user_id")

	err := repository.Transfer(fromID, input.ToUserID, input.Amount)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "transfer success"})
}
