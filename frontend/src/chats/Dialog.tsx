import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Dialog = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You are not authenticated.');
      return;
    }

    // Initialize WebSocket connection
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/`);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, { content: data.message }]);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error', err);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(ws);

    return () => {
      if (ws) {
        ws.close(); // Close WebSocket when component unmounts
      }
    };
  }, [chatId]);

  const sendMessage = () => {
    if (!socket) {
      setError('WebSocket is not connected.');
      return;
    }
    if (newMessage.trim()) {
      socket.send(JSON.stringify({ message: newMessage }));
      setNewMessage('');
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Chat</h1>
      <button onClick={() => navigate('/chats')}>Back to Chats</button>
      <button onClick={logout}>Log Out</button>
      {error && <p>{error}</p>}
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message.content}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Dialog;
