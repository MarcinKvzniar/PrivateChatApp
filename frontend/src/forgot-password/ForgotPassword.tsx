import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ForgotPasswordPage.css'; // Import CSS

const ForgotPasswordPage: React.FC = () => {
  const [secretPhrase, setSecretPhrase] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handlePasswordRecovery = () => {
    //  logic to check the secret phrase and allow password recovery
    const recoverySuccessful = true;

    if (recoverySuccessful) {
      setMessage('Secret phrase accepted! You may now reset your password.');
    } else {
      setMessage('Incorrect secret phrase. Please try again.');
    }
  };

  const handleReturnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      <input
        type="text"
        className="input-field"
        placeholder="Enter secret phrase"
        value={secretPhrase}
        onChange={(e) => setSecretPhrase(e.target.value)}
      />
      <button className="login-button" onClick={handlePasswordRecovery}>
        Recover Password
      </button>
      <button className="return-button" onClick={handleReturnToLogin}>
        Return to Login
      </button>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default ForgotPasswordPage;
