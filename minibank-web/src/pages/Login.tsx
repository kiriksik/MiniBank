import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="container max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Вход</h2>
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
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
