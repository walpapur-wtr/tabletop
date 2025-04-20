import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PathForm = ({ config }) => {
  const [formData, setFormData] = useState({ sections: {} });
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  if (!config || !config.sections) {
    return <p>Конфігурація не знайдена або некоректна.</p>;
  }

  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    const sectionName = config.sections[currentStep].name;

    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionName]: {
          ...prev.sections[sectionName],
          [fieldName]: value,
        },
      },
    }));
  };

  const saveCharacter = async (data) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("Token not found. Please log in again.");
      }

      const response = await fetch("/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in the header
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to save character: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Character saved successfully:", result);
    } catch (err) {
      console.error("Error saving character:", err);
    }
  };

  const handleNextStep = async () => {
    if (currentStep < config.sections.length - 1) {
      await saveCharacter({ ...formData, system: config.system, version: config.version }); // Додаємо system і version
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveCharacter({ ...formData, system: config.system, version: config.version }); // Додаємо system і version
    navigate(`/characters/${formData.sections.General.name}`); // Переходимо на сторінку перегляду
  };

  const currentSection = config.sections[currentStep];

  return (
    <form className="character-form" onSubmit={handleSubmit}>
      <h2 className="character-form__title">{currentSection.name}</h2>
      {currentSection.fields.map((field) => (
        <div key={field.name} className="character-form__field">
          <label htmlFor={field.name} className="character-form__label">{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type || "text"}
            defaultValue={formData.sections[currentSection.name]?.[field.name] || field.default || ""}
            required={field.required || false}
            onChange={(e) => handleInputChange(e, field.name)}
            className="character-form__input"
          />
        </div>
      ))}
      <div className="character-form__navigation">
        {currentStep > 0 && <button type="button" className="navigation-button" onClick={() => setCurrentStep((prev) => prev - 1)}>Назад</button>}
        {currentStep < config.sections.length - 1 ? (
          <button type="button" className="navigation-button" onClick={handleNextStep}>Далі</button>
        ) : (
          <button type="submit" className="save-button">Зберегти персонажа</button>
        )}
      </div>
    </form>
  );
};

export default PathForm;
