import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:8080/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUsername(data.username || data.email || 'Пользователь');
        }
      } catch (err) {
        console.error('Ошибка загрузки пользователя:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Логотип */}
        <div className="navbar-logo">
          💰 MiniBank
        </div>

        {/* Навигация */}
        <div className="navbar-links">
          <Link to="/" className="navbar-link navbar-link-main">
            Главная
          </Link>
          <Link to="/transactions" className="navbar-link">
            Транзакции
          </Link>
          <Link to="/transfer" className="navbar-link">
            Перевод
          </Link>
        </div>

        {/* Пользователь + Выйти */}
        <div className="navbar-user">
          {username && (
            <span>
              👤 {username}
            </span>
          )}
          <button onClick={handleLogout} className="navbar-logout-btn">
            Выйти
          </button>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;
