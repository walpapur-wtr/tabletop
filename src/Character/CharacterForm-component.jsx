import React, { useState, useEffect } from "react";
import { rollDice } from "../DiceRoller/Roll-script";
import "./CharacterGrid-styles.css";

export const CharacterForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [sections, setSections] = useState([]);
  const [system, setSystem] = useState("dnd");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Завантаження конфігураційного файлу для вибраної системи
    import(`../../configs/${system}.json`)
      .then((config) => {
        setSections(config.sections);
        setErrors({});
      })
      .catch((err) => {
        console.error("Error loading config:", err);
        setErrors((prev) => ({
          ...prev,
          system: "Невідома система.",
        }));
      });
  }, [system]);

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
      onSubmit({ system, sections: formData });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="character-form">
      <div className="character-form__field">
        <label>System</label>
        <select value={system} onChange={(e) => setSystem(e.target.value)}>
          <option value="dnd">DnD</option>
          <option value="call_of_cthulhu">Call of Cthulhu</option>
          <option value="vasen">Vasen</option>
        </select>
        {errors.system && <span className="error">{errors.system}</span>}
      </div>
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
