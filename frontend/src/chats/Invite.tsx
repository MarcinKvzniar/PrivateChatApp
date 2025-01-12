import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import './Invite.css';

interface Invitation {
  id: number;
  inviter_username?: string;
  receiver_username?: string;
  question: string;
  receiver_answer?: string | null;
  status: string;
}

interface ErrorResponse {
  detail?: string;
}

const InvitationPage = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [newInvitation, setNewInvitation] = useState({
    username: '',
    question: '',
  });

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await axios.get(
        'http://127.0.0.1:8000/api/current-user/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentUser(response.data.username);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('You must be logged in to access this page.');
        return;
      }

      const response = await axios.get(
        'http://127.0.0.1:8000/pending-invitations/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setInvitations(response.data);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, question } = newInvitation;

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/invite/',
        { receiver_username: username, question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert(response.data.detail);
      setNewInvitation({ username: '', question: '' });
      fetchInvitations();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      alert(axiosError.response?.data?.detail || 'Error sending invitation.');
    }
  };

  const handleSubmitAnswer = async (invitationId: number, answer: string) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        'http://127.0.0.1:8000/api/invite/',
        { invitation_id: invitationId, answer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Answer submitted successfully.');
      fetchInvitations();
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer.');
    }
  };

  const handleAction = async (invitationId: number, action: string) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(
        'http://127.0.0.1:8000/api/invite/',
        { invitation_id: invitationId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Action performed successfully.');
      fetchInvitations();
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Failed to perform action.');
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchInvitations();
    }
  }, [currentUser]);

  return (
    <div className="invitation-page">
      <h1>Invitation Page</h1>

      <div className="invitation-container">
        <div className="send-invitation">
          <h2>Send an Invitation</h2>
          <form onSubmit={handleSendInvitation}>
            <input
              type="text"
              placeholder="Username"
              value={newInvitation.username}
              onChange={(e) =>
                setNewInvitation({ ...newInvitation, username: e.target.value })
              }
            />
            <textarea
              placeholder="Question"
              value={newInvitation.question}
              onChange={(e) =>
                setNewInvitation({ ...newInvitation, question: e.target.value })
              }
            ></textarea>
            <button type="submit">Send</button>
          </form>
        </div>

        <div className="all-invitations">
          <h2>All Invitations</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            invitations.map((inv) => (
              <div key={inv.id} className="invitation">
                <p>
                  <strong>From:</strong> {inv.inviter_username}{' '}
                  <strong>To:</strong> {inv.receiver_username}
                </p>
                <p>
                  <strong>Question:</strong> {inv.question}
                </p>
                <p>
                  <strong>Status:</strong> {inv.status}
                </p>

                {inv.status === 'PENDING' &&
                  currentUser === inv.receiver_username && (
                    <div>
                      <textarea
                        placeholder="Write your answer..."
                        value={answers[inv.id] || ''}
                        onChange={(e) =>
                          setAnswers({ ...answers, [inv.id]: e.target.value })
                        }
                      ></textarea>
                      <button
                        onClick={() =>
                          handleSubmitAnswer(inv.id, answers[inv.id])
                        }
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}

                {inv.status === 'AWAITING_REVIEW' &&
                  currentUser === inv.inviter_username && (
                    <div>
                      <p>
                        <strong>Answer:</strong> {inv.receiver_answer}
                      </p>
                      <button onClick={() => handleAction(inv.id, 'accept')}>
                        Accept
                      </button>
                      <button onClick={() => handleAction(inv.id, 'reject')}>
                        Reject
                      </button>
                    </div>
                  )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationPage;
