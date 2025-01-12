import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset link sent to', email);
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handlePasswordReset} className="forgot-password-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="reset-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
