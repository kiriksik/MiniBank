import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert('Регистрация прошла успешно!');
        setUsername('');
        setPassword('');
        navigate('/login'); // редирект на логин
      } else {
        alert('Ошибка регистрации');
      }
    } catch (error) {
      alert('Ошибка при отправке запроса');
      console.error(error);
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Регистрация</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block">
          Имя пользователя:
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block">
          Пароль:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
