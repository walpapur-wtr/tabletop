import React, { useState, useEffect } from "react";
import { rollDice } from "../../DiceRoller/Roll-script";

export const CharacterSheetEdit = ({ character, onSave, onCancel }) => {
  const [formData, setFormData] = useState(character.sections);
  const [sections, setSections] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Завантаження конфігураційного файлу для вибраної системи
    fetch(`/api/systems/${character.system}/${character.version}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Не вдалося завантажити конфігурацію системи');
        }
        return response.json();
      })
      .then((config) => {
        setSections(config.sections);
        setErrors({});
      })
      .catch((err) => {
        console.error("Error loading config:", err);
        setErrors((prev) => ({
          ...prev,
          system: err.message || "Невідома система.",
        }));
      });
  }, [character.system, character.version]);

  const handleChange = (e, sectionName) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [name]: value,
      },
    }));
  };

  const handleRoll = async (field, sectionName) => {
    const rollResult = await rollDice("4d6");
    const sortedRolls = rollResult.rolls.map(r => r.value).sort((a, b) => a - b);
    const total = sortedRolls.slice(1).reduce((sum, roll) => sum + roll, 0);
    setFormData((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        [field]: total,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.required && (!formData[section.name] || !formData[section.name][field.name])) {
          newErrors[`${section.name}.${field.name}`] = `Поле ${field.label} є обов'язковим.`;
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        name: character.name,
        system: character.system,
        version: character.version,
        sections: formData
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="character-form">
      {sections.map((section) => (
        <div key={section.name} className="character-form__section">
          <h3>{section.name}</h3>
          {section.fields.map((field) => (
            <div key={field.name} className="character-form__field">
              <label>{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                value={formData[section.name]?.[field.name] || ""}
                onChange={(e) => handleChange(e, section.name)}
                required={field.required}
                className="character-form__input"
              />
              {field.rollable && (
                <button type="button" onClick={() => handleRoll(field.name, section.name)}>
                  Roll
                </button>
              )}
              {errors[`${section.name}.${field.name}`] && <span className="error">{errors[`${section.name}.${field.name}`]}</span>}
            </div>
          ))}
        </div>
      ))}
      <div className="character-form__actions">
        <button type="submit" className="character-form__button character-form__button--submit">
          Save
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
