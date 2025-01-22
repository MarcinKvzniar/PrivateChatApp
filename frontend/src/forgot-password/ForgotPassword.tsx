import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordPage.css';

const ForgotPasswordPage: React.FC = () => {
  const [secretPhrase, setSecretPhrase] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handlePasswordRecovery = () => {
    const recoverySuccessful = true; // Replace with actual logic

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
    <div className="page-container">
      <div className="left-section">
        <div className="squares-container">
          <div className="square">🌟 Confidentiality Above All</div>
          <div className="square">🛡️ Control is Key</div>
          <div className="square">🔒 Privacy by Design</div>
          <div className="square">🤝 Trust through Transparency</div>
        </div>
      </div>
      <div className="right-section">
        <div className="forgot-password-container">
          <h1 className="login-title">Forgot Password</h1>
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
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
