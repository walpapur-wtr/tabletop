import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DiceRollerComponent from "../DiceRoller/DiceRoller-component.jsx";
import ModalMessage from "./ModalMessage.jsx";
import "./IconButtons-styles.css";

const DiceRollerButton = () => {
  const [isDiceRollerVisible, setDiceRollerVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const toggleDiceRoller = () => {
    setDiceRollerVisible(!isDiceRollerVisible);
  };

  const handleCreateCharacterClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
    } else {
      navigate("/create-character/dnd/lunocus"); // Example path, adjust as needed
    }
  };

  const redirectToLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  return (
    <>
      <div className="mobile-create-character-icon" onClick={handleCreateCharacterClick}>
        ➕
      </div>
      <div className="mobile-dice-roller-icon" onClick={toggleDiceRoller}>
        🎲
      </div>
      {isDiceRollerVisible && (
        <div className="mobile-dice-roller-popup">
          <button className="close-popup" onClick={toggleDiceRoller}>
            ✖
          </button>
          <DiceRollerComponent />
        </div>
      )}
      {showLoginModal && (
        <ModalMessage
          message="Please log in to create a character."
          onClose={() => setShowLoginModal(false)}
          onConfirm={redirectToLogin}
        />
      )}
    </>
  );
};

export default DiceRollerButton;
