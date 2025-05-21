package model

type Summary struct {
	TotalReceived float64 `json:"total_received"`
	TotalSent     float64 `json:"total_sent"`
	TotalTopUp    float64 `json:"total_topup"`
	TotalWithdraw float64 `json:"total_withdraw"`
}
