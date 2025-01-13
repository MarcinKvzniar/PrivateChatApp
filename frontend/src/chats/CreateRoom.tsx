import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Friend {
  username: string;
}

const CreateRoom = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('You are not authenticated.');
          return;
        }

        const response = await axios.get(
          'http://localhost:8000/api/current-user/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCurrentUser(response.data.username);
      } catch (err) {
        setError('Failed to load current user.');
        console.error(err);
      }
    };

    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('You are not authenticated.');
          return;
        }

        const response = await axios.get('http://localhost:8000/friendships/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFriends(
          response.data.map((friendship: any) => ({
            username:
              friendship.user1_username === response.data.current_user
                ? friendship.user2_username
                : friendship.user1_username,
          }))
        );
      } catch (err) {
        setError('Failed to load friends.');
        console.error(err);
      }
    };

    fetchCurrentUser();
    fetchFriends();
  }, []);

  const handleCreateRoom = async () => {
    if (!selectedFriend || !roomName) {
      setError(
        'Please enter a room name and select a friend to create a room.'
      );
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('You are not authenticated.');
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/create-room/',
        { room_name: roomName, participant: selectedFriend },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/chat/${response.data.chat_id}`);
    } catch (err: any) {
      setError('Failed to create room.');
      console.error(err);
    }
  };

  const filteredFriends = friends.filter(
    (friend) => friend.username !== currentUser
  );

  return (
    <div>
      <h1>Create Room</h1>
      {error && <p>{error}</p>}
      <div>
        <label>Room Name:</label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
        />
      </div>
      <div>
        <label>Select a friend to chat with:</label>
        <select
          value={selectedFriend || ''}
          onChange={(e) => setSelectedFriend(e.target.value)}
        >
          <option value="" disabled>
            -- Select a friend --
          </option>
          {filteredFriends.map((friend) => (
            <option key={friend.username} value={friend.username}>
              {friend.username}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default CreateRoom;
