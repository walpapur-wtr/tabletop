import React from "react";
import { Link } from "react-router-dom";
import "./Character-styles.css";

export const CharacterCard = ({ character, onAddClick }) => {
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

  return (
    <Link to={`/characters/${character.name}`} className="character-card-link">
      <div className="character-card">
        <img
          src={character.image}
          alt={character.name}
          className="character-card__image"
        />
        <div className="character-card__content">
          <h2 className="character-card__name">{character.name}</h2>
          <p className="character-card__details">Level: {character.level}</p>
          <p className="character-card__details">Class: {character.class}</p>
          <p className="character-card__details">Race: {character.race}</p>
          <div className="character-card__stats">
            <p>STR: {character.strength}</p>
            <p>DEX: {character.dexterity}</p>
            <p>CON: {character.constitution}</p>
            <p>INT: {character.intelligence}</p>
            <p>WIS: {character.wisdom}</p>
            <p>CHA: {character.charisma}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
