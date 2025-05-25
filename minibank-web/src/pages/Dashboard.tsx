import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('http://localhost:8080/api/balance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Fetch balance response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('Balance data:', data);

        setBalance(data.balance);

      } else {
        console.error('Ошибка загрузки баланса');
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="container max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      {balance === null ? (
        <p className="text-gray-400">Загрузка баланса...</p>
      ) : (
        <p className="text-xl">
          Ваш баланс: <span className="font-bold">{balance.toFixed(2)}</span> ₽
        </p>
      )}
    </div>
  );
};

export default Dashboard;
