import React, { useEffect, useState } from 'react';

type Transaction = {
  id: number;
  from_user_id: number;
  to_user_id: number;
  amount: number;
  created_at: string;
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

useEffect(() => {
  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:8080/api/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Transactions response:', data);

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error('Некорректный формат ответа от API:', data);
          setTransactions([]); // fallback
        }
      } else {
        console.error('Ошибка при получении транзакций:', res.status);
      }
    } catch (error) {
      console.error('Сетевая ошибка:', error);
    }
  };

  fetchTransactions();
}, []);


  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Транзакции</h1>
      <ul className="divide-y divide-gray-300">
        {transactions.map(tx => (
          <li key={tx.id} className="py-3 flex justify-between">
            <span>От {tx.from_user_id} к {tx.to_user_id}</span>
            <span>{tx.amount} ₽</span>
            <span className="text-gray-500">{new Date(tx.created_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
