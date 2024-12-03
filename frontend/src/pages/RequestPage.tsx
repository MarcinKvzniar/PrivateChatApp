import React, { useState } from 'react';

const RequestPage: React.FC = () => {
  const [requests, setRequests] = useState([
    { id: 1, inviter: 'User1', question: "What's your favorite color?" },
    { id: 2, inviter: 'User2', question: "What's your pet's name?" },
  ]);

  const handleDecline = (id: number) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    alert(`Request ${id} declined (simulation, no backend).`);
  };

  const handleAccept = (id: number) => {
    alert(`Request ${id} accepted! Redirecting to Answer Page...`);
    // You can use navigation logic here, e.g., React Router
  };

  return (
    <div>
      <h1>Request Page</h1>
      <ul>
        {requests.map((req) => (
          <li key={req.id}>
            {req.inviter}: {req.question}
            <button onClick={() => handleAccept(req.id)}>Accept</button>
            <button onClick={() => handleDecline(req.id)}>Decline</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestPage;
