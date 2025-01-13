import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './login/LoginPage';
import ForgotPassword from './forgot-password/ForgotPassword';
import RegisterPage from './register/RegisterPage';
import NotFoundPage from './NotFoundPage';
import ChatList from './chats/ChatList';
import Dialog from './chats/Dialog';
import Invite from './chats/Invite';
import CreateRoom from './chats/CreateRoom';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/invite" element={<Invite />} />

          <Route
            path="/create-room"
            element={
              isAuthenticated ? <CreateRoom /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/chats"
            element={isAuthenticated ? <ChatList /> : <Navigate to="/login" />}
          />

          <Route
            path="/chats/:chatId"
            element={isAuthenticated ? <Dialog /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
