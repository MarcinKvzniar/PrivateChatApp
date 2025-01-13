import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Chat = {
  chat_id: string;
  chat_name: string;
};

const ChatList = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('You are not authenticated.');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/chats/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setChats(response.data);
      } catch (err) {
        setError('Failed to load chats.');
        console.error(err);
      }
    };

    fetchChats();
  }, []);

  return (
    <div>
      <h1>Chats</h1>
      {error && <p>{error}</p>}
      {chats.length === 0 && <p>No chats available. Create one to start!</p>}

      <ul>
        {chats.map((chat) => (
          <li
            key={chat.chat_id}
            onClick={() => navigate(`/chats/${chat.chat_id}`)}
          >
            {chat.chat_name}
          </li>
        ))}
      </ul>

      <button onClick={() => navigate('/invite')}>invitations</button>
    </div>
  );
};

export default ChatList;
