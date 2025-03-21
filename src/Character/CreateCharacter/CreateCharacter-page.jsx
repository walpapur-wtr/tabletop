import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CreateCharacter-styles.css";
import HeaderComponent from "../../components/Header-component.jsx";
import FooterComponent from "../../components/Footer-component.jsx";
import DiceRollerButton from "../../components/DiceRollerButton.jsx";

const CreateCharacterPage = () => {
  const { system } = useParams();
  const [sections, setSections] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Завантаження конфігурації системи
    fetch(`/configs/${system}.json`)
      .then((res) => res.json())
      .then((data) => setSections(data.sections))
      .catch((err) => console.error("Error loading config:", err));
  }, [system]);

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

  const saveSection = () => {
    // Збереження даних на сервері
    fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system,
        sections: formData,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Character saved:", data))
      .catch((err) => console.error("Error saving character:", err));
  };

  const goToNextSection = () => {
    saveSection();
    setCurrentSectionIndex((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const goToPreviousSection = () => {
    setCurrentSectionIndex((prev) => Math.max(prev - 1, 0));
  };

  if (sections.length === 0) {
    return <p>Завантаження...</p>;
  }

  const currentSection = sections[currentSectionIndex];

  return (
    <div className="create-character-page">
      <HeaderComponent className="header" />
      <div className="character-form">
        <h2>{currentSection.name}</h2>
        {currentSection.fields.map((field) => (
          <div key={field.name} className="character-form__field">
            <label>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[currentSection.name]?.[field.name] || ""}
              onChange={(e) => handleInputChange(e, currentSection.name)}
              required={field.required}
            />
          </div>
        ))}
        <div className="character-form__navigation">
          {currentSectionIndex > 0 && (
            <button onClick={goToPreviousSection} className="navigation-button">
              ← Назад
            </button>
          )}
          {currentSectionIndex < sections.length - 1 && (
            <button onClick={goToNextSection} className="navigation-button">
              Далі →
            </button>
          )}
        </div>
      </div>
      <DiceRollerButton />
      <FooterComponent className="footer" />
    </div>
  );
};

export default CreateCharacterPage;
