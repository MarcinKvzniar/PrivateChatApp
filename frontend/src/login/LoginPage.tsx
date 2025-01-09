import React, { useState } from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const LoginPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/user/login/', {
        username: nickname,
        password,
      });

      if (response.data && response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        console.log('Login successful');
        navigate('/chats'); 
      } else {
        setErrorMessage('Login failed: No token received.');
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response) {
        setErrorMessage(error.response.data.detail || 'Login failed');
      } else if (error.request) {
        setErrorMessage('No response from the server. Please try again.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to Your Secret Chat</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <div className="links">
        <Link to="/register" className="register-link">
          Register
        </Link>
        <Link to="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
