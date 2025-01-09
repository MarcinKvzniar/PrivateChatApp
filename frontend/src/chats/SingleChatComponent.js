import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const SingleChat = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(`/chats/${chatId}/messages/`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    setSocket(ws);
    return () => ws.close();
  }, [chatId]);

  const sendMessage = async () => {
    if (socket && newMessage.trim()) {
      socket.send(
        JSON.stringify({
          message: newMessage,
          sender_id: 1, // Replace with authenticated user's ID
        })
      );
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender_id}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default SingleChat;
