import React, { useEffect, useState } from 'react';

type Transaction = {
  id: number;
  from_user_id: number | null;
  from_username: string | null;
  to_user_id: number | null;
  to_username: string | null;
  amount: number;
  created_at: string;
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [myUserId, setMyUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserAndTransactions = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const meRes = await fetch('http://localhost:8080/api/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) throw new Error('Ошибка загрузки пользователя');
        const meData = await meRes.json();

        setMyUserId(meData.id);

        const txRes = await fetch('http://localhost:8080/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!txRes.ok) throw new Error('Ошибка загрузки транзакций');
        const txData = await txRes.json();
        if (Array.isArray(txData)) {
          setTransactions(txData);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserAndTransactions();
  }, []);

  if (myUserId === null) {
    return <div className="text-center mt-6 text-gray-500">Загрузка...</div>;
  }

  return (
    
    <div className="transactions-container max-w-3xl mx-auto p-4">
      <h1 className="transactions-title text-2xl font-bold mb-6">Транзакции</h1>
      <ul className="transactions-list divide-y divide-gray-200">
        {transactions.map(tx => {
          const isOutgoing = Number(tx.from_user_id) === Number(myUserId);
          const isIncoming = Number(tx.to_user_id) === Number(myUserId);

          // console.log('Me:', myUserId, 'From:', tx.from_user_id, 'To:', tx.to_user_id);

          const otherUsername = isOutgoing
            ? tx.to_username
            : isIncoming
              ? tx.from_username
              : `${tx.from_username} → ${tx.to_username}`;

          const arrow = isOutgoing ? '→' : isIncoming ? '←' : '⇄';
          const sign = isOutgoing ? '-' : isIncoming ? '+' : '';
          const amountColorClass = isOutgoing ? 'amount-negative' : isIncoming ? 'amount-positive' : 'amount-neutral';


          const displayAmount = `${sign}${tx.amount.toFixed(2)} ₽`;

          return (
            <li key={tx.id} className={`transaction-item py-3 flex justify-between items-center`}>
              <div className={`transaction-info flex items-center gap-2`}>
                <span className={`arrow ${amountColorClass} text-xl font-semibold`}>
                  {arrow}
                </span>
                <span className="other-username text-base font-medium username-highlight">
                  {otherUsername || '(неизвестно)'}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className={`transaction-amount text-lg font-semibold ${amountColorClass}`}>
                  {displayAmount}
                </span>
                <span className="transaction-date text-sm text-gray-500">
                  {new Date(tx.created_at).toLocaleString()}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Transactions;
