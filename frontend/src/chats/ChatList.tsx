// ChatList.tsx
import React from 'react';

type ChatListProps = {
  openChat: (chat: { id: string; name: string }) => void;
};

const ChatList: React.FC<ChatListProps> = ({ openChat }) => {
  // Example list of chats (replace with dynamic data or API calls)
  const chats = [
    { id: '1', name: 'Chat 1' },
    { id: '2', name: 'Chat 2' },
  ];

  return (
    <div>
      <h1>Chat List</h1>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} onClick={() => openChat(chat)}>
            {chat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
