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

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'chatList' | 'dialog'>(
    'chatList'
  );
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated by checking the access token in localStorage
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const openChat = (chat: { id: string; name: string }) => {
    setSelectedChat(chat);
    setCurrentPage('dialog');
  };

  const goBack = () => {
    setCurrentPage('chatList');
  };

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
            path="/chats"
            element={
              isAuthenticated ? (
                <ChatList openChat={openChat} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {currentPage === 'dialog' && selectedChat && (
            <Route
              path={`/chats/${selectedChat.id}`}
              element={
                isAuthenticated ? (
                  <Dialog chat={selectedChat} goBack={goBack} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          )}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
