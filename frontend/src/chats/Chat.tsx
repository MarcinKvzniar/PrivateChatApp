import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

type Message = {
  sender: string;
  content: string;
  timestamp: string;
};

const Chat = () => {
  const { chat_id } = useParams<{ chat_id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
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
          `http://localhost:8000/api/chat/${chat_id}/messages/`,
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
  }, [chat_id]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      setError('Message cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You are not authenticated.');
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/chat/${chat_id}/messages/`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      {error && <p>{error}</p>}
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          maxHeight: '400px',
          overflowY: 'scroll',
        }}
      >
        {messages.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{message.sender}:</strong> {message.content}
            <div style={{ fontSize: '0.8em', color: '#888' }}>
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={3}
          placeholder="Type your message..."
          style={{ width: '100%', resize: 'none' }}
        />
        <button onClick={sendMessage} style={{ marginTop: '5px' }}>
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Chat;
