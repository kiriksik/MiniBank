-- +goose up
UPDATE balances SET amount = 1000 WHERE user_id = 1;

-- +goose down
UPDATE balances SET amount = 0 WHERE user_id = 1;