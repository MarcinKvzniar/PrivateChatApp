import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Chat = {
  chat_id: string;
  chat_name: string;
};

const ChatList = ({ openChat }: { openChat: (chat: Chat) => void }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook to navigate

  useEffect(() => {
    const fetchChats = async () => {
      try {
        let token = localStorage.getItem('access_token');
        if (!token) {
          setError('You are not authenticated.');
          return;
        }

        try {
          const response = await axios.get(
            'http://localhost:8000/api/chats/available/',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setChats(response.data);
        } catch (err: any) {
          // If token is invalid/expired, attempt to refresh it
          if (err.response && err.response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              setError('No refresh token found. Please log in again.');
              return;
            }

            const refreshResponse = await axios.post(
              'http://localhost:8000/api/token/refresh/',
              {
                refresh: refreshToken,
              }
            );
            token = refreshResponse.data.access;

            if (token) {
              localStorage.setItem('access_token', token);

              // Retry fetching the chats with the new token
              const retryResponse = await axios.get(
                'http://localhost:8000/api/chats/available/',
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setChats(retryResponse.data);
            } else {
              setError('Failed to refresh token.');
            }
          } else {
            setError('Failed to load chats.');
          }
        }
      } catch (err) {
        setError('Failed to load chats.');
        console.error(err);
      }
    };

    fetchChats();
  }, []);

  // Navigate to invite page
  const handleInviteClick = () => {
    navigate('/invite');
  };

  return (
    <div>
      <h1>Chats</h1>
      {error && <p>{error}</p>}
      <ul>
        {chats.map((chat) => (
          <li key={chat.chat_id} onClick={() => openChat(chat)}>
            {chat.chat_name}
          </li>
        ))}
      </ul>
      <button className="invite-button" onClick={handleInviteClick}>
        Invitations
      </button>{' '}
      {/* Invite Button */}
    </div>
  );
};

export default ChatList;
