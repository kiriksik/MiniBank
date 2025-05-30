import React, { useEffect, useState } from 'react';
import { FaCreditCard } from 'react-icons/fa';

const Dashboard = () => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

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
          console.error('Ошибка загрузки баланса');
        }
      } catch (error) {
        console.error('Сервер недоступен:', error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Добро пожаловать!</h1>

      <div className="balance-card">
        <div className="balance-info">
          <p className="balance-label">Ваш баланс</p>
          {balance === null ? (
            <p className="balance-loading">Загрузка...</p>
          ) : (
            <p className="balance-amount">{balance.toFixed(2)} ₽</p>
          )}
        </div>
        <FaCreditCard size={48} className="balance-icon" />
      </div>
    </div>
  );
};

export default Dashboard;
