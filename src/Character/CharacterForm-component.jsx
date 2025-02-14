import React, { useState } from "react";
//import { DiceRoller } from "rpg-dice-roller";
import "./Character-styles.css";

export const CharacterForm = ({ onSubmit, onCancel }) => {
  //const roller = new DiceRoller();

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    class: "",
    race: "",
    image: "",
    strength: "",
    dexterity: "",
    constitution: "",
    intelligence: "",
    wisdom: "",
    charisma: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["level", "strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].includes(name)
        ? Number(value) || ""
        : value,
    }));
  };

  // const rollStat = (stat) => {
  //   const roll = roller.roll("4d6"); // Кидаємо 4 кубики d6
  //   const diceResults = roll.rolls[0].rolls.map(die => die.value); // Отримуємо масив чисел з об'єктів
  
  //   console.log(`Rolls for ${stat}:`, diceResults);
  
  //   const sortedDice = diceResults.sort((a, b) => a - b).slice(1); // Видаляємо найменший результат
  //   const statValue = sortedDice.reduce((sum, val) => sum + val, 0); // Обчислюємо суму 3 найбільших

  //   console.log(`Final ${stat} value:`, statValue); // Лог для перевірки
  
  //   setFormData((prev) => ({ ...prev, [stat]: statValue })); // Записуємо лише підсумкове значення
  // };




  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="character-form">
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="character-form__input"
      />
      <input
        name="level"
        placeholder="Level"
        type="number"
        value={formData.level}
        onChange={handleChange}
        required
        className="character-form__input"
      />
      <input
        name="class"
        placeholder="Class"
        value={formData.class}
        onChange={handleChange}
        required
        className="character-form__input"
      />
      <input
        name="race"
        placeholder="Race"
        value={formData.race}
        onChange={handleChange}
        required
        className="character-form__input"
      />
      <input
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
        required
        className="character-form__input"
      />
      {["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].map((stat) => (
        <div key={stat} className="character-form__stat">
          <input
            name={stat}
            placeholder={stat.charAt(0).toUpperCase() + stat.slice(1)}
            type="number"
            value={formData[stat]}
            onChange={handleChange}
            className="character-form__input"
          />
          <button
            type="button"
            //onClick={() => rollStat(stat)}
            className="character-form__button character-form__button--roll"
          >
            Roll
          </button>
        </div>
      ))}
      <div className="character-form__actions">
        <button type="submit" className="character-form__button character-form__button--submit">
          Create
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="character-form__button character-form__button--cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
