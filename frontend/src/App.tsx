import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './login/LoginPage';
import ForgotPassword from './forgot-password/ForgotPassword';
import RegisterPage from './register/RegisterPage';
import NotFoundPage from './NotFoundPage';
import ChatList from './chats/ChatList';
import Dialog from './chats/Dialog';


const App: React.FC = () => {
  // State to manage current page and selected chat
  const [currentPage, setCurrentPage] = useState<'chatList' | 'dialog'>(
    'chatList'
  );
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Simulating user authentication (use actual login check in your app)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // just a simulation
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to open a chat and go to the dialog
  const openChat = (chat: { id: string; name: string }) => {
    setSelectedChat(chat);
    setCurrentPage('dialog');
  };

  // Function to go back to the chat list
  const goBack = () => {
    setCurrentPage('chatList');
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protect chat routes with authentication check */}
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

          {/* Not Found route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
