//Home-page.jsx
import React, { useEffect, useState } from "react";
import HeaderComponent from "../components/Header-component";
import FooterComponent from "../components/Footer-component.jsx";
import CharacterCard from "../Character/CharacterCard-component.jsx";
import DiceRollerButton from "../components/DiceRollerButton.jsx";
import "../styles/Home-styles.css";

const HomePage = () => {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetch("/api/characters")
      .then((res) => res.json())
      .then((data) => setCharacters(data))
      .catch((err) => console.error("Error fetching characters:", err));
  }, []);

  return (
    <div className="home-page">
      <HeaderComponent />
      <div className="home-page__content">
        <div className="character-grid">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </div>
      <DiceRollerButton />
      <FooterComponent />
    </div>
  );
};

export default HomePage;
