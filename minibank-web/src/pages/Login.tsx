import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка входа');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/'); // Редирект на защищенную страницу
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Вход</h2>
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

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary">
          Войти
        </button>
      </form>

      <div className="form-footer">
        <p>Нет аккаунта?&nbsp;
          <Link to="/register" className="btn-secondary-link">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
