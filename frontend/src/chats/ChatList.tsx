import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Chat {
  chat_id: string;
  chat_name: string;
}

interface ChatListProps {
  openChat: (chat: { id: string; name: string }) => void;
}

const ChatList: React.FC<ChatListProps> = ({ openChat }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const navigate = useNavigate(); // Initialize the navigation function

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/friendships/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div>
      <h2>Your Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.chat_id}
            onClick={() => openChat({ id: chat.chat_id, name: chat.chat_name })}
          >
            {chat.chat_name}
          </li>
        ))}
      </ul>
      {/* Button to navigate to the Invite page */}
      <button
        onClick={() => navigate('/invite')}
        style={{
          marginTop: '20px',
          padding: '10px 15px',
          backgroundColor: '#574caf',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Invites
      </button>
    </div>
  );
};

export default ChatList;
