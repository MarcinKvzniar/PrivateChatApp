// Dialog.tsx
import React from 'react';

type DialogProps = {
  chat: { id: string; name: string };
  goBack: () => void;
};

const Dialog: React.FC<DialogProps> = ({ chat, goBack }) => {
  return (
    <div>
      <div>
        <button onClick={goBack}>Back</button>
        <h1>{chat.name}</h1>
      </div>
      <div>
        {/* Here would be the messages for this chat */}
        <p>Messages for {chat.name}</p>
      </div>
    </div>
  );
};

export default Dialog;
