import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleLogin} style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '8px', width: '350px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h2>
        {error && <div style={{ color: 'var(--accent-red)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <div style={{ marginBottom: '1rem' }}>
          <input type="text" placeholder="Username" className="input-field" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <input type="password" placeholder="Password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
