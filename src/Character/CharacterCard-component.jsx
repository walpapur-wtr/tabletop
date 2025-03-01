import React from "react";
import { Link } from "react-router-dom";
import "./CharacterGrid-styles.css";

export const CharacterCard = ({ character, onAddClick }) => {
  console.log("CharacterCard received character:", character);

  if (!character) {
    return (
      <div
        className="character-card character-card--empty"
        onClick={onAddClick}
      >
        <span className="character-card__add-icon">+</span>
      </div>
    );
  }

  // Отримуємо ім'я персонажа з секцій, якщо воно там знаходиться
  const characterName = character.name || character.sections?.General?.name;

  return (
    <Link to={`/characters/${characterName}`} className="character-card-link">
      <div className="character-card">
        <img
          src={character.image}
          alt={characterName}
          className="character-card__image"
        />
        <div className="character-card__content">
          <h2 className="character-card__name">{characterName}</h2>
        </div>
      </div>
    </Link>
  );
};
