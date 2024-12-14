import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // Import your Axios instance

type ChatListProps = {
  openChat: (chat: { id: string; name: string }) => void;
};

const ChatList: React.FC<ChatListProps> = ({ openChat }) => {
  const [chats, setChats] = useState<{ id: string; name: string }[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch chats from the backend
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          const response = await axiosInstance.get('/user/chats/', {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Add the token to the header
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
      {errorMessage && <p>{errorMessage}</p>}
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
    </div>
  );
};

export default ChatList;
