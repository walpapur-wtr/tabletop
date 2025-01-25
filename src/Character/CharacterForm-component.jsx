import React, { useState } from "react";
import "./Character-styles.css";

export const CharacterForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    class: "",
    race: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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