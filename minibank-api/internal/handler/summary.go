package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiriksik/minibank/minibank-api/internal/repository"
)

type SummaryResponse struct {
	TotalReceived float64 `json:"total_received"`
	TotalSent     float64 `json:"total_sent"`
	TotalTopUp    float64 `json:"total_topup"`
	TotalWithdraw float64 `json:"total_withdraw"`
}

func GetSummary(c *gin.Context) {
	userID := c.GetInt("user_id")

	summary, err := repository.GetSummary(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get summary"})
		return
	}

	c.JSON(http.StatusOK, summary)
}
