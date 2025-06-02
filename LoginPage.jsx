
import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      alert('Login Successful!');

      
      if (role === 'admin') {
        window.location.href = '/admin-dashboard';
      } else if (role === 'citizen') {
        window.location.href = '/citizen-dashboard';
      } else {
        window.location.href = '/officer-dashboard';
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4 login-card">
        <h3 className="text-center mb-4">Traffic Violation System Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <p className="mt-3 text-center">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
