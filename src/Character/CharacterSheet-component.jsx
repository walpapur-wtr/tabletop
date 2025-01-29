import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CharacterSheet = () => {
  const { name } = useParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/characters/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setCharacter(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Помилка завантаження персонажа:", err);
        setLoading(false);
      });
  }, [name]);

  if (loading) return <p>Завантаження...</p>;
  if (!character) return <p>Персонаж не знайдений.</p>;

  return (
    <div className="character-sheet">
      <h1>{character.name}</h1>
      <p>Level: {character.level}</p>
      <p>Class: {character.class}</p>
      <p>Race: {character.race}</p>
      <img src={character.image} alt={character.name} className="character-sheet__image" />
      
      <div className="character-sheet__stats">
        <h2>Характеристики</h2>
        <p>Сила (STR): {character.strength}</p>
        <p>Спритність (DEX): {character.dexterity}</p>
        <p>Тілобудова (CON): {character.constitution}</p>
        <p>Інтелект (INT): {character.intelligence}</p>
        <p>Мудрість (WIS): {character.wisdom}</p>
        <p>Харизма (CHA): {character.charisma}</p>
      </div>
    </div>
  );
};

export default CharacterSheet;
