import React, { useState } from 'react';

const InvitePage: React.FC = () => {
  const [receiverId, setReceiverId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSendInvitation = () => {
    console.log('Receiver ID:', receiverId);
    console.log('Question:', question);
    console.log('Answer:', answer);
    alert('Invitation sent (simulation, no backend).');
  };

  return (
    <div>
      <h1>Invite Page</h1>
      <input
        type="text"
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <input
        type="text"
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button onClick={handleSendInvitation}>Send Invitation</button>
    </div>
  );
};

export default InvitePage;
