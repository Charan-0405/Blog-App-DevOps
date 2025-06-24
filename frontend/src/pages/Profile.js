import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [editing, setEditing] = useState(false);
  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setBio(res.data.bio || '');
    } catch (err) {
      alert('Error fetching profile');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/profile`, { bio }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(false);
      fetchProfile();
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Your Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      
      {editing ? (
        <>
          <textarea
            rows="4"
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
          <br />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: '10px' }}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Bio:</strong> {profile.bio || 'Not set'}</p>
          <button onClick={() => setEditing(true)}>Edit Bio</button>
        </>
      )}
    </div>
  );
}

export default Profile;
