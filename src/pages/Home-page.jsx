//Home-page.jsx
import React, { useState } from "react";
import DiceRollerComponent from "../DiceRoller/DiceRoller-component.jsx";
import HeaderComponent from "../components/Header-component";
import FooterComponent from "../components/Footer-component.jsx";
import CharacterGrid from "../Character/CharacterGrid-component.jsx";
import "../styles/Home-styles.css";

const HomePage = () => {
  const [isDiceRollerVisible, setDiceRollerVisible] = useState(false);

  const toggleDiceRoller = () => {
    setDiceRollerVisible(!isDiceRollerVisible);
  };

  return (
    <div className="home-page">
      <HeaderComponent />
      <CharacterGrid />
      {/* Mobile Dice Roller Icon */}
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
      <FooterComponent />
    </div>
  );
};

export default HomePage;
