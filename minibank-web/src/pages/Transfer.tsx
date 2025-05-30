import React, { useState, useEffect } from 'react';

const Transfer: React.FC = () => {
  const [toUsername, setToUsername] = useState('');
  const [amount, setAmount] = useState<string>(''); // теперь строка для удобства ввода
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const presetAmounts = [100, 250, 500, 1000];
  const allowedAmounts = balance !== null ? presetAmounts.filter((a) => a <= balance) : [];

  // Загрузка баланса
  const fetchBalance = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Неавторизован');
      setLoadingBalance(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/balance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
      } else {
        setMessage('Ошибка загрузки баланса');
      }
    } catch (error) {
      setMessage('Сервер недоступен');
    } finally {
      setLoadingBalance(false);
    }
  };

  // Загрузка имени текущего пользователя
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Неавторизован');
      setLoadingUser(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUsername(data.username || data.email || null);
      } else {
        setMessage('Ошибка загрузки пользователя');
      }
    } catch (error) {
      setMessage('Сервер недоступен');
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchCurrentUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const numericAmount = parseFloat(amount);

    if (!toUsername.trim()) {
      setMessage('Введите имя пользователя');
      return;
    }

    if (currentUsername && toUsername.trim() === currentUsername) {
      setMessage('Нельзя отправить перевод самому себе');
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setMessage('Введите корректную сумму для перевода');
      return;
    }

    if (balance !== null && numericAmount > balance) {
      setMessage('Недостаточно средств');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Неавторизован');
      return;
    }

    const res = await fetch('http://localhost:8080/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to_username: toUsername.trim(),
        amount: numericAmount,
      }),
    });

    if (res.ok) {
      setMessage('Перевод выполнен');
      setToUsername('');
      setAmount('');
      fetchBalance(); // обновим баланс
    } else {
      const err = await res.json();
      setMessage(`Ошибка: ${err.message || 'Что-то пошло не так'}`);
    }
  };

  const handlePresetClick = (val: number) => {
    setAmount(val.toString());
  };

  if (loadingBalance || loadingUser) {
    return <p>Загрузка...</p>;
  }

  return (
    <div className="transfer-container">
      <div className="transfer-box">
        <h1 className="transfer-title">Перевод денег</h1>

        <p>Баланс: {balance?.toFixed(2)} ₽</p>

        <form onSubmit={handleSubmit} className="transfer-form">
          <label>
            Кому:
            <input
              type="text"
              value={toUsername}
              onChange={e => setToUsername(e.target.value)}
              required
              autoComplete="off"
            />
          </label>

          <label>
            Сумма:
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="0"
              max={balance ?? undefined}
              placeholder="Введите сумму"
              required
            />
          </label>

          <div className="preset-amounts">
            {allowedAmounts.length > 0 ? (
              allowedAmounts.map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`preset-btn ${parseFloat(amount) === val ? 'selected' : ''}`}
                  onClick={() => handlePresetClick(val)}
                >
                  {val}
                </button>
              ))
            ) : (
              <p>Недостаточно средств для перевода</p>
            )}
          </div>

          <button
            type="submit"
            className="transfer-submit-btn"
            disabled={
              !amount ||
              isNaN(parseFloat(amount)) ||
              parseFloat(amount) <= 0 ||
              (balance !== null && parseFloat(amount) > balance)
            }
          >
            Отправить
          </button>
        </form>

        {message && <p className="transfer-message">{message}</p>}
      </div>
    </div>
  );
};

export default Transfer;
