import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderComponent from "../../components/Header-component.jsx";
import FooterComponent from "../../components/Footer-component.jsx";
import CharacterSheet from "./CharacterSheet-component.jsx";
import { CharacterSheetEdit } from "../CharacterSheetEdit-component";
import "./CharacterSheet-styles.css";

const CharacterPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  //отримання даних про персонажа з сервера
  useEffect(() => {
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
      .then((res) => res.json())
      .then((data) => {
        setCharacter(data.character);
        setIsEditing(false);
      })
      .catch((err) => console.error("Error updating character:", err));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="character-page">
      <HeaderComponent />
      <div className="character-page__content">
        {loading && <p>Завантаження...</p>}
        {error && <p className="error">{error}</p>}
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
      <FooterComponent />
    </div>
  );
};

export default CharacterPage;
