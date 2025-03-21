import React, { useState, useEffect } from "react";
import { rollDice } from "../../DiceRoller/Roll-script";

const DnDForm = ({ currentStep, setCurrentStep }) => {
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Завантаження конфігурації
    fetch("/configs/dnd.json")
      .then((res) => res.json())
      .then((data) => setSections(data.sections))
      .catch((err) => console.error("Error loading config:", err));
  }, []);

  const handleInputChange = (e, sectionName) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [name]: value,
      },
    }));
  };

  const handleDiceRoll = async (sectionName, fieldName) => {
    try {
      const rollResult = await rollDice("4d6");
      const sortedRolls = rollResult.rolls.map((r) => r.value).sort((a, b) => b - a);
      const total = sortedRolls.slice(0, 3).reduce((sum, val) => sum + val, 0);

      setFormData((prev) => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          [fieldName]: total,
        },
      }));
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  };

  const saveCharacter = () => {
    // Збереження даних на сервері
    fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system: "dnd",
        sections: formData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Character saved:", data);
        // Перехід на сторінку персонажа
        window.location.href = `/character/${data.character.id}`;
      })
      .catch((err) => console.error("Error saving character:", err));
  };

  if (sections.length === 0) {
    return <p>Завантаження...</p>;
  }

  const currentSection = sections[currentStep];

  return (
    <div className="character-form">
      <h2>{currentSection.name}</h2>
      {currentSection.fields.map((field) => (
        <div key={field.name} className="character-form__field">
          <label>{field.label}</label>
          <div className="character-form__input-group">
            <input
              type={field.type}
              name={field.name}
              value={formData[currentSection.name]?.[field.name] || ""}
              onChange={(e) => handleInputChange(e, currentSection.name)}
              required={field.required}
            />
            {field.rollable && (
        <button
          type="button"
          className="dice-roll-button"
          onClick={() => handleDiceRoll(currentSection.name, field.name)}
        >
          🎲
        </button>
      )}
          </div>
        </div>
      ))}
      <div className="character-form__navigation">
        <button onClick={saveCharacter} className="save-button">
          Зберегти
        </button>
      </div>
    </div>
  );
};

export default DnDForm;
