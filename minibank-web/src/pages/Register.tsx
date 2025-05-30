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
    <div className="form-container">
      <h2 className="form-title">Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="username">Имя пользователя:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="form-input"
        />

        <label className="form-label" htmlFor="password">Пароль:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="form-input"
        />

        <button type="submit" className="btn-success">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Register;
