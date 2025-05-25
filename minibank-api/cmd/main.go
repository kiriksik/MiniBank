package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kiriksik/minibank/minibank-api/internal/handler"
	"github.com/kiriksik/minibank/minibank-api/internal/middleware"
	"github.com/kiriksik/minibank/minibank-api/pkg/database"
)

func main() {
	router := gin.Default()
	if err := database.Init(); err != nil {
		log.Fatal("Database error:", err)
	}
	if err := database.Migrate(database.DB); err != nil {
		log.Fatal("Migration error:", err)
	}
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},

		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	api := router.Group("/api")
	{
		api.POST("/register", handler.Register)
		api.POST("/login", handler.Login)
	}

	auth := api.Group("/")
	{
		auth.Use(middleware.AuthMiddleware())
		auth.GET("/me", func(ctx *gin.Context) {
			ctx.JSON(http.StatusOK, gin.H{"message": "authorized!"})
		})
		auth.GET("/balance", handler.GetBalance)
		auth.POST("/transfer", handler.Transfer)
		auth.GET("/transactions", handler.GetTransactions)
		auth.POST("/withdraw", handler.Withdraw)
		auth.POST("/topup", handler.Withdraw)
		auth.GET("/summary", handler.GetSummary)
	}

	log.Println("Starting server on: 8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}

}
