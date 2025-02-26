import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderComponent from "../../components/Header-component.jsx";
import FooterComponent from "../../components/Footer-component.jsx";
import CharacterSheet from "./CharacterSheet-component.jsx";
import "./CharacterSheet-styles.css";

const CharacterPage = () => {
  const { characterName } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //отримання даних про персонажа з сервера
  useEffect(() => {
    fetch(`/api/characters/${characterName}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Персонаж не знайдений");
        }
        return res.json();
      })
      .then((data) => {
        setCharacter(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [characterName]);

  return (
    <div className="character-page">
      <HeaderComponent />
      <div className="character-page__content">
        {loading && <p>Завантаження...</p>}
        {error && <p className="error">{error}</p>}
        {character && <CharacterSheet character={character} />}
      </div>
      <FooterComponent />
    </div>
  );
};

export default CharacterPage;
