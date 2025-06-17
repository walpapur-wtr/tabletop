import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CharacterCard from "./CharacterCard-component";
import "./CharacterGrid-styles.css";

const CharacterGrid = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCharacters = async () => {
      try {
        const response = await fetch("/api/characters", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch characters");
        }

        const data = await response.json();
        setCharacters(data.characters || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [navigate]);

  const handleCreateCharacter = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/create-character");
    }
  };

  if (loading) return <div>Loading characters...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="character-grid-container">
      <div className="character-grid">
        {characters.map((character, index) => (
          <CharacterCard key={index} character={character} />
        ))}
        <div
          className="character-card create-character"
          onClick={handleCreateCharacter}
        >
          <div className="create-character-content">
            <span className="plus-icon">+</span>
            <p>Create New Character</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterGrid;
