import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  return (
    <nav className="flex items-center bg-gray-800 p-4 border-b border-gray-700 text-white">
      <Link to="/" className="mr-6 hover:underline">Dashboard</Link>
      <Link to="/transactions" className="mr-6 hover:underline">Транзакции</Link>
      <Link to="/transfer" className="mr-auto hover:underline">Перевод</Link>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded"
      >
        Выйти
      </button>
    </nav>
  );
};

export default Navbar;
