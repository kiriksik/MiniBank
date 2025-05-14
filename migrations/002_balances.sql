-- +goose Up
CREATE TABLE IF NOT EXISTS balances (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0
);

-- +goose Down
DROP TABLE IF EXISTS balances;