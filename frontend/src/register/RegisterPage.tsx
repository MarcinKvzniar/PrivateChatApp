import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    // registration logic here (e.g., send data to backend)
    // Simulating successful registration:
    const registrationSuccessful = true;

    if (registrationSuccessful) {
      setMessage('Registration successful! Redirecting to Login...');
      // Redirect to the login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
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
      <button className="login-button" onClick={handleRegister}>
        Register
      </button>
      {message && <div>{message}</div>}
    </div>
  );
};

export default RegisterPage;
