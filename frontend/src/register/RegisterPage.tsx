import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setMessage('');
    setError('');

    try {
      const response = await axiosInstance.post('user/register/', {
        username: username.trim(),
        password,
      });

      if (response.status === 201) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      if (err.response) {
        setError(
          err.response.data.detail || 'Registration failed. Please try again.'
        );
      } else if (err.request) {
        setError('No response from the server. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="login-container">
      {' '}
      {/* Reuse the same class for styling */}
      <h2 className="login-title">Register</h2>{' '}
      {/* Reuse the same title class */}
      <form className="login-form">
        {' '}
        {/* Reuse the same form class */}
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="login-button"
          onClick={handleRegister} // Use the same button styling
        >
          Register
        </button>
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        {/* Back to login link */}
        <div className="links">
          <p className="back-to-login">
            Remembered you had an account and remembered password?{' '}
            <a href="/login" className="back-to-login-link">
              Back to Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
