import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DnDForm = ({ config }) => {
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
      const response = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Не вдалося зберегти персонажа.");
      console.log("Character saved successfully:", data);
    } catch (err) {
      console.error("Error saving character:", err);
    }
  };

  const handleNextStep = async () => {
    if (currentStep < config.sections.length - 1) {
      await saveCharacter({ ...formData, system: config.name }); // Додаємо system
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveCharacter({ ...formData, system: config.name }); // Додаємо system
    navigate(`/characters/${formData.sections.General.name}`); // Переходимо на сторінку перегляду
  };

  const currentSection = config.sections[currentStep];

  return (
    <form className="dnd-form" onSubmit={handleSubmit}>
      <h2>{currentSection.name}</h2>
      {currentSection.fields.map((field) => (
        <div key={field.name} className="form-field">
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            name={field.name}
            type={field.type || "text"}
            defaultValue={formData.sections[currentSection.name]?.[field.name] || field.default || ""}
            required={field.required || false}
            onChange={(e) => handleInputChange(e, field.name)}
          />
        </div>
      ))}
      <div className="form-navigation">
        {currentStep > 0 && <button type="button" onClick={() => setCurrentStep((prev) => prev - 1)}>Назад</button>}
        {currentStep < config.sections.length - 1 ? (
          <button type="button" onClick={handleNextStep}>Далі</button>
        ) : (
          <button type="submit">Зберегти персонажа</button>
        )}
      </div>
    </form>
  );
};

export default DnDForm;
