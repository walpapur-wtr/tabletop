import React, { useState, useEffect } from "react";
import { CharacterCard } from "./CharacterCard-component";
import { CharacterForm } from "./CharacterForm-component";
import "./CharacterGrid-styles.css";

export const CharacterGrid = () => {
  const [characters, setCharacters] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    // Fetch characters from server
    fetch("/api/characters")
      .then((res) => res.json())
      .then((data) => setCharacters(data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddCharacter = (newCharacter) => {
    // Send new character to server
    fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCharacter),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.character) {
          setCharacters((prev) => [...prev, data.character]);
        } else {
          console.error("Error creating character:", data.error);
        }
      })
      .catch((err) => console.error(err));

    setIsFormVisible(false);
  };

  return (
    <div className="character-grid">
      {characters.map((character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
      <CharacterCard onAddClick={() => setIsFormVisible(true)} />
      {isFormVisible && (
        <div className="character-grid__form">
          <CharacterForm
            onSubmit={handleAddCharacter}
            onCancel={() => setIsFormVisible(false)}
          />
        </div>
      )}
    </div>
  );
};
