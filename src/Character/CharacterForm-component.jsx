import React, { useState, useEffect } from "react";
import "./CharacterGrid-styles.css";

export const CharacterForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);
  const [system, setSystem] = useState("dnd");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Завантаження конфігураційного файлу для вибраної системи
    console.log(`Loading config for system: ${system}`);
    import(`../configs/${system}.json`)
      .then((config) => {
        console.log("Config loaded:", config);
        setFields(config.fields);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `Поле ${field.label} є обов'язковим.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ system, ...formData });
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
      {fields.map((field) => (
        <div key={field.name} className="character-form__field">
          <label>{field.label}</label>
          <input
            name={field.name}
            type={field.type}
            value={formData[field.name] || ""}
            onChange={handleChange}
            required={field.required}
            className="character-form__input"
          />
          {errors[field.name] && <span className="error">{errors[field.name]}</span>}
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
