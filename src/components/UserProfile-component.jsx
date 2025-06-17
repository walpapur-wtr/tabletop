import React, { useState } from "react";
import EditProfile from "./EditProfile-component";
import "./UserProfile-styles.css";

const UserProfile = ({ onLogout }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [userData, setUserData] = useState({
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email")
  });

  const handleProfileUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  return (
    <div className="user-profile">
      <div className="user-profile__avatar">
        <img src="/default-avatar.png" alt="Profile Avatar" />
      </div>
      <div className="user-profile__info">
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email || "Not provided"}</p>
        <button 
          className="user-profile__edit-button"
          onClick={() => setShowEditModal(true)}
        >
          Налаштування профілю
        </button>
      </div>
      <button
        className="user-profile__logout"
        onClick={onLogout}
      >
        Вихід
      </button>
      
      {showEditModal && (
        <EditProfile
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
          currentUsername={userData.username}
          currentEmail={userData.email}
        />
      )}
    </div>
  );
};

export default UserProfile;
