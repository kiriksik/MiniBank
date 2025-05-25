import React, { useState } from 'react';

const Transfer = () => {
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

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
        to_id: parseInt(toId),
        amount: parseFloat(amount),
      }),
    });

    if (res.ok) {
      setMessage('Перевод выполнен');
      setToId('');
      setAmount('');
    } else {
      const err = await res.json();
      setMessage(`Ошибка: ${err.message || 'Что-то пошло не так'}`);
    }
  };

  return (
    <div className="container">
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Перевод денег</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Кому (ID):
          <input
            type="number"
            value={toId}
            onChange={e => setToId(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <label>
          Сумма:
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Отправить
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
    </div>
  );
};

export default Transfer;
