import React, { useEffect, useState, type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';
import Navbar from './components/Navbar';

import { useLocation } from 'react-router-dom';
import './index.css';
import './App.css';





const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [tokenChecked, setTokenChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    setTokenChecked(true);
  }, []);

  if (!tokenChecked) {
    return <div className="text-center p-6 text-gray-400">Загрузка...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      
      <div className={`app-container ${location.pathname === '/' ? 'no-padding' : ''}`}>
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <Transfer />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
