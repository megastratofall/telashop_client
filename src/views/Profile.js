import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);

useEffect(() => {
const fetchUserData = async () => {
try {
    const response = await axiosInstance.get('/client/profile');
    setUser(response.data);
} catch (error) {
    console.error('Error fetching user data:', error);
}
};

fetchUserData();
}, []);

if (!user) {
return (
<div className="loading-container">
<div className="loading">Loading...</div>
</div>
);
}

return (
<div className="profile-container">
<div className="profile-card">
      <img src="http://localhost:8000/storage/usericon.png" alt="User Icon" className="user-icon" />
      <h2>{user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Dirección:</strong> {user.address}</p>
</div>
</div>
);
};

export default Profile;
