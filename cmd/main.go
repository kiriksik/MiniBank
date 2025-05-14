package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiriksik/minibank/internal/handler"
	"github.com/kiriksik/minibank/internal/middleware"
	"github.com/kiriksik/minibank/pkg/database"
)

func main() {
	router := gin.Default()
	if err := database.Init(); err != nil {
		log.Fatal("Database error:", err)
	}
	if err := database.Migrate(database.DB); err != nil {
		log.Fatal("Migration error:", err)
	}

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
		auth.GET("/transfer", handler.Transfer)
	}

	log.Println("Starting server on: 8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}

}
