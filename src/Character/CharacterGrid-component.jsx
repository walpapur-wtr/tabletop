import React, { useState, useEffect } from "react";
import { CharacterCard } from "./CharacterCard-component";
import { useNavigate } from "react-router-dom";
import "./CharacterGrid-styles.css";
import SystemModal from "./CreateCharacter/SystemModal-component";

export const CharacterGrid = () => {
  const [characters, setCharacters] = useState([]);
  const [isSystemModalVisible, setIsSystemModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/characters")
      .then((res) => res.json())
      .then((data) => {
        console.log("Characters loaded:", data);
        setCharacters(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSystemSelect = (system, version) => {
    setIsSystemModalVisible(false);
    console.log(`Navigating to create-character/${system}/${version}`);
    navigate(`/create-character/${system}/${version}`);
};

  return (
    <div className="character-grid">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
      <CharacterCard onAddClick={() => setIsSystemModalVisible(true)} />
      {isSystemModalVisible && (
        <SystemModal
          onClose={() => setIsSystemModalVisible(false)}
          onSystemSelect={handleSystemSelect}
        />
      )}
    </div>
  );
};

export default CharacterGrid;
