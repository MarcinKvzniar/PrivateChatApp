import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dialog = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('You are not authenticated.');
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/chats/${chatId}/messages/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessages(response.data);
      } catch (err) {
        setError('Failed to load messages.');
        console.error(err);
      }
    };

    fetchMessages();
  }, [chatId]);

  const sendMessage = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You are not authenticated.');
        return;
      }

      await axios.post(
        `http://localhost:8000/api/chats/${chatId}/messages/`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [...prev, { content: newMessage }]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message.');
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div>
      <h1>Chat</h1>
      <button onClick={() => navigate('/chats')}>Back to Chats</button>
      <button onClick={logout}>Log Out</button> {/* Log out button */}
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
