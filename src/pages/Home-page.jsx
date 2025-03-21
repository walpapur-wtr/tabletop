//Home-page.jsx
import React, { useState } from "react";
import DiceRollerComponent from "../DiceRoller/DiceRoller-component.jsx";
import HeaderComponent from "../components/Header-component";
import FooterComponent from "../components/Footer-component.jsx";
import CharacterGrid from "../Character/CharacterGrid-component.jsx";
import "../styles/Home-styles.css";
import DiceRollerButton from "../components/DiceRollerButton.jsx";

const HomePage = () => {
  const [isDiceRollerVisible, setDiceRollerVisible] = useState(false);

  const toggleDiceRoller = () => {
    setDiceRollerVisible(!isDiceRollerVisible);
  };

  return (
    <div className="home-page">
      <HeaderComponent />
      <div style={{ flex: 1 }}>
        <CharacterGrid />
      </div>
      <DiceRollerButton />
      <FooterComponent />
    </div>
  );
};

export default HomePage;
