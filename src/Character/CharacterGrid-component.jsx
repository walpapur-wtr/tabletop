import React, { useState, useEffect } from "react";
import { CharacterCard } from "./CharacterCard-component";
import { useNavigate } from "react-router-dom";
import "./CharacterGrid-styles.css";
import SystemModal from "../components/SystemModal-component";

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

  const handleSystemSelect = (system, basedOn) => {
    setIsSystemModalVisible(false);
    const systemName = system.replace(".json", ""); // Remove .json if present
    const targetComponent = basedOn.toLowerCase() === "dnd" ? "DnDForm" : "CustomForm";
    navigate(`/create-character/${systemName}?component=${targetComponent}`);
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
