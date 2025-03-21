import React, { useState, useEffect } from "react";
import { CharacterCard } from "./CharacterCard-component";
import { useNavigate } from "react-router-dom";
import "./CharacterGrid-styles.css";

export const CharacterGrid = () => {
  const [characters, setCharacters] = useState([]);
  const [isSystemModalVisible, setIsSystemModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch characters from server
    fetch("/api/characters")
      .then((res) => res.json())
      .then((data) => {
        console.log("Characters loaded:", data);
        setCharacters(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSystemSelect = (system) => {
    setIsSystemModalVisible(false);
    navigate(`/create-character/${system}`);
  };

  return (
    <div className="character-grid">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
      <CharacterCard onAddClick={() => setIsSystemModalVisible(true)} />
      {isSystemModalVisible && (
        <div className="system-modal">
          <div className="system-modal__content">
            <h3>Виберіть систему</h3>
            <ul className="system-modal__list">
              {["DnD", "PathFinder", "Call of Cthulhu", "Vaesen", "Custom"].map((system) => (
                <li
                  key={system}
                  className="system-modal__item"
                  onClick={() => handleSystemSelect(system.toLowerCase())}
                >
                  {system}
                </li>
              ))}
            </ul>
            <button
              className="system-modal__close"
              onClick={() => setIsSystemModalVisible(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterGrid;
