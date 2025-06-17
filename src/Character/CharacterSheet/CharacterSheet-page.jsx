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
    const fetchCharacter = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Необхідно увійти в систему');
          navigate('/login');
          return;
        }

        console.log('Fetching character:', name); // Debug log

        const response = await fetch(`/api/characters/${encodeURIComponent(name)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Server error response:', errorData); // Debug log
          throw new Error(errorData.message || 'Помилка завантаження персонажа');
        }

        const data = await response.json();
        console.log('Character data received:', data); // Debug log

        if (!data.success || !data.character) {
          throw new Error('Некоректні дані персонажа');
        }

        setCharacter(data.character);
        
        // Fetch system config
        const configResponse = await fetch(`/api/systems/${data.character.system}/${data.character.version}`);
        
        if (!configResponse.ok) {
          throw new Error('Помилка завантаження конфігурації системи');
        }

        const configData = await configResponse.json();
        setConfig(configData);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [name, navigate]);

  const handleSave = async (updatedCharacter) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Необхідно увійти в систему');
      }

      const response = await fetch(`/api/characters/${encodeURIComponent(name)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedCharacter),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Не вдалося оновити персонажа");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Не вдалося оновити персонажа");
      }

      setCharacter(data.character);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating character:", err);
      setError(err.message || "Не вдалося оновити персонажа.");
    }
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
