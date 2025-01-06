import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

type ChatListProps = {
  openChat: (chat: { id: string; name: string }) => void;
};

const ChatList: React.FC<ChatListProps> = ({ openChat }) => {
  const [chats, setChats] = useState<{ id: string; name: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Fetch chats from the backend
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          const response = await axiosInstance.get('/user/chats/', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setChats(response.data);
        } else {
          setErrorMessage('No access token found.');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        setErrorMessage('Failed to load chats.');
      }
    };

    fetchChats();
  }, []);

  return (
    <div>
      <h1>Chat List</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}

      <ul>
        {chats.length === 0 ? (
          <p>No chats available</p>
        ) : (
          chats.map((chat) => (
            <li key={chat.id} onClick={() => openChat(chat)}>
              {chat.name}
            </li>
          ))
        )}
      </ul>

      <button onClick={() => navigate('/invite')}>Go to Invite Page</button>
    </div>
  );
};

export default ChatList;
