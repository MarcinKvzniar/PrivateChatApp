import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

type Message = {
  message_id: string;
  sender: string;
  content: string;
  sent_at: string;
};

const ChatComponent: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/chats/${chatId}/messages/`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${chatId}/`);
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    return () => {
      ws.close();
    };
  }, [chatId]);

  const handleSendMessage = () => {
    if (socket && newMessage.trim()) {
      socket.send(JSON.stringify({ message: newMessage }));
      setNewMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.message_id}>
            <strong>{message.sender}</strong>: {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="new-message">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
