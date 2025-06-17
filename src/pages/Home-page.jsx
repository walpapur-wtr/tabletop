//Home-page.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderComponent from "../components/Header-component";
import FooterComponent from "../components/Footer-component.jsx";
import CharacterCard from "../Character/CharacterCard-component.jsx";
import DiceRollerButton from "../components/DiceRollerButton.jsx";
import "../styles/Home-styles.css";

const HomePage = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const fetchCharacters = async () => {
      try {
        const response = await fetch("/api/characters", {
          headers: token ? {
            "Authorization": `Bearer ${token}`
          } : {}
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Для неавторизованих користувачів показуємо порожній список
            setCharacters([]);
          } else {
            throw new Error("Failed to fetch characters");
          }
        } else {
          const data = await response.json();
          setCharacters(data.characters || []);
        }
      } catch (err) {
        console.error("Error fetching characters:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleCreateCharacter = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/create-character");
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading characters...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    return (
      <div className="character-grid">
        {characters.length === 0 ? (
          <div className="welcome-section">
            <h2>Ласкаво просимо до Character Sheet Manager!</h2>
            <p>Тут ви можете створювати та керувати вашими ігровими персонажами.</p>
            <button 
              onClick={handleCreateCharacter} 
              className="create-character-button"
            >
              {isAuthenticated ? "Створити персонажа" : "Увійдіть щоб створити персонажа"}
            </button>
          </div>
        ) : (
          <>
            {characters.map((character) => (
              <CharacterCard 
                key={character.id || character.name} 
                character={character} 
                isAuthenticated={isAuthenticated}
              />
            ))}
            {isAuthenticated && (
              <div className="character-card create-character" onClick={handleCreateCharacter}>
                <div className="create-character-content">
                  <span className="plus-icon">+</span>
                  <p>Створити нового персонажа</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="home-page">
      <HeaderComponent />
      <div className="home-page__content">
        {renderContent()}
      </div>
      <DiceRollerButton />
      <FooterComponent />
    </div>
  );
};

export default HomePage;
