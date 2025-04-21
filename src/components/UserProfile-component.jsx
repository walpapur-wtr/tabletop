import React from "react";
import "./UserProfile-styles.css";

const UserProfile = ({ onLogout }) => {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email"); // Припускаємо, що email зберігається в localStorage

  return (
    <div className="user-profile">
      <div className="user-profile__avatar">
        <img src="/default-avatar.png" alt="Profile Avatar" />
      </div>
      <div className="user-profile__info">
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email || "Not provided"}</p>
      </div>
      <button
        className="user-profile__logout"
        onClick={() => {
          if (onLogout) {
            onLogout(); // Викликаємо функцію виходу
          } else {
            console.error("onLogout function is not provided");
          }
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
