import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Invitation {
  id: string;
  receiver_username: string;
  question: string;
  status: string; // 'pending', 'accepted', etc.
}

const InvitesPage: React.FC = () => {
  const [receiverUsername, setReceiverUsername] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  // Fetch all invitations when the page loads
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/invite/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setInvitations(response.data); // Set invitations to state
      } catch (error) {
        setMessage('Failed to load invitations.');
      }
    };

    fetchInvitations();
  }, []);

  const handleReceiverUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceiverUsername(e.target.value);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSendInvitation = async () => {
    if (!receiverUsername || !question) {
      setMessage('Please fill in both fields.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Send a POST request to create the invitation
      const response = await axios.post(
        'http://localhost:8000/api/invite/',
        {
          receiver_username: receiverUsername,
          question: question,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      setMessage('Invitation sent successfully!');

      // Fetch updated invitations list
      const updatedInvitations = await axios.get(
        'http://localhost:8000/api/invitations/',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setInvitations(updatedInvitations.data); // Update list
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data.detail || 'Something went wrong.');
      } else {
        setMessage('An error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="invites-page">
      <h2>Invite a Friend</h2>

      {/* Invitation Form */}
      <div>
        <label htmlFor="receiver-username">Receiver's Username:</label>
        <input
          type="text"
          id="receiver-username"
          value={receiverUsername}
          onChange={handleReceiverUsernameChange}
        />
      </div>

      <div>
        <label htmlFor="question">Question:</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={handleQuestionChange}
        />
      </div>

      <button onClick={handleSendInvitation} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Invitation'}
      </button>

      {message && <p>{message}</p>}

      {/* List of Invitations */}
      <h3>Sent Invitations</h3>
      <div>
        {invitations.length === 0 ? (
          <p>No invitations sent yet.</p>
        ) : (
          <ul>
            {invitations.map((invite) => (
              <li key={invite.id}>
                <strong>To: {invite.receiver_username}</strong>
                <p>Question: {invite.question}</p>
                <p>Status: {invite.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InvitesPage;
