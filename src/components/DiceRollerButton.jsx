import React, { useState } from "react";
import DiceRollerComponent from "../DiceRoller/DiceRoller-component.jsx";
import "../DiceRoller/DiceRoller-styles.css";

const DiceRollerButton = () => {
  const [isDiceRollerVisible, setDiceRollerVisible] = useState(false);

  const toggleDiceRoller = () => {
    setDiceRollerVisible(!isDiceRollerVisible);
  };

  return (
    <>
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
    </>
  );
};

export default DiceRollerButton;
