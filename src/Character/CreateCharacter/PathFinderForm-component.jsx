import React, { useState } from "react";
import { rollDice } from "../../DiceRoller/Roll-script";

const PathfinderForm = ({ sections = [] }) => { // Default to an empty array
  console.log("PathFinderForm received sections:", sections);
  const [formData, setFormData] = useState({});

  if (!Array.isArray(sections) || sections.length === 0) {
    console.log("PathFinderForm received sections:", sections);
    console.error("Invalid or empty 'sections' prop passed to DnDForm:", sections);
    return <p>Немає доступних секцій для цієї системи.</p>;
  }

  const handleInputChange = (e, sectionName) => {
    const { name, value } = e.target;
    console.log(`Input changed in section "${sectionName}", field "${name}":`, value);
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
      console.log(`Rolling dice for section "${sectionName}", field "${fieldName}"`);
      const rollResult = await rollDice("4d6");
      const sortedRolls = rollResult.rolls.map((r) => r.value).sort((a, b) => b - a);
      const total = sortedRolls.slice(0, 3).reduce((sum, val) => sum + val, 0);
      console.log(`Dice roll result for "${fieldName}":`, total);

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
    const token = localStorage.getItem("token"); // Retrieve token
    fetch("/api/characters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token in the header
      },
      body: JSON.stringify({
        system: "dnd",
        sections: formData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Character saved successfully:", data);
        window.location.href = `/character/${data.character.id}`;
      })
      .catch((err) => console.error("Error saving character:", err));
  };

  return (
    <div className="character-form">
      {sections.map((section) => (
        <div key={section.name} className="character-form__section">
          <h2>{section.name}</h2>
          {section.fields.map((field) => (
            <div key={field.name} className="character-form__field">
              <label>{field.label}</label>
              <div className="character-form__input-group">
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[section.name]?.[field.name] || ""}
                  onChange={(e) => handleInputChange(e, section.name)}
                  required={field.required}
                />
                {field.rollable && (
                  <button
                    type="button"
                    className="dice-roll-button"
                    onClick={() => handleDiceRoll(section.name, field.name)}
                  >
                    🎲
                  </button>
                )}
              </div>
            </div>
          ))}
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

export default PathfinderForm;
