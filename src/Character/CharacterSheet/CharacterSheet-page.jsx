import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../../components/Header-component.jsx";
import FooterComponent from "../../components/Footer-component.jsx";
import CharacterSheet from "./CharacterSheet-component.jsx";
import { CharacterSheetEdit } from "./CharacterSheetEdit-component";
import DiceRollerComponent from "../../DiceRoller/DiceRoller-component.jsx";
import DiceRollerButton from "../../components/DiceRollerButton.jsx";
import "./CharacterSheet-styles.css";

const CharacterPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDiceRollerVisible, setDiceRollerVisible] = useState(false);

  const toggleDiceRoller = () => {
    setDiceRollerVisible(!isDiceRollerVisible);
  };

  useEffect(() => {
    // Завантаження персонажа
    fetch(`/api/characters/${name}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Персонаж не знайдений");
        }
        return res.json();
      })
      .then((data) => {
        setCharacter(data);
        return fetch(`/configs/${data.system}.json`);
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Конфігураційний файл не знайдений");
        }
        return res.json();
      })
      .then((configData) => {
        setConfig(configData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading character or config:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [name]);

  const handleSave = (updatedCharacter) => {
    fetch(`/api/characters/${name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCharacter),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Не вдалося оновити персонажа");
        }
        return res.json();
      })
      .then((data) => {
        setCharacter(data.character);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error("Error updating character:", err);
        setError("Не вдалося оновити персонажа.");
      });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="character-page" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <HeaderComponent />
      <div className="character-page__content" style={{ flex: 1 }}>
        {character && config && (
          isEditing ? (
            <CharacterSheetEdit character={character} onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <div className="character-sheet">
              <CharacterSheet character={character} config={config} />
              <button onClick={() => setIsEditing(true)} className="edit-button">
                Edit
              </button>
            </div>
          )
        )}
      </div>
      <DiceRollerButton />
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

export default CharacterPage;
