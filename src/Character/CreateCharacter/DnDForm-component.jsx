import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rollDice } from "../../DiceRoller/Roll-script"; // Import rollDice function

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

    setFormData((prev) => {
      const updatedSections = {
        ...prev.sections,
        [sectionName]: {
          ...prev.sections[sectionName],
          [fieldName]: value,
        },
      };

      // Automatically calculate the modifier if the field is an attribute
      const attributeFields = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
      if (attributeFields.includes(fieldName)) {
        const attributeValue = parseInt(value, 10);
        const modifier = isNaN(attributeValue) ? "" : Math.floor((attributeValue - 10) / 2);
        updatedSections[sectionName][`${fieldName}-modifier`] = modifier;
      }

      return { ...prev, sections: updatedSections };
    });
  };

  const handleRoll = async (field, sectionName, formula) => {
    try {
      const rollResult = await rollDice(formula);
      const sortedRolls = rollResult.rolls.map((r) => r.value).sort((a, b) => a - b);
      const total = sortedRolls.slice(1).reduce((sum, roll) => sum + roll, 0); // Sum the highest 3 rolls

      setFormData((prev) => {
        const updatedSections = {
          ...prev.sections,
          [sectionName]: {
            ...prev.sections[sectionName],
            [field]: total,
          },
        };

        // Calculate the modifier immediately after rolling
        const modifier = Math.floor((total - 10) / 2);
        updatedSections[sectionName][`${field}-modifier`] = modifier;

        return { ...prev, sections: updatedSections };
      });
    } catch (err) {
      console.error("Error rolling dice:", err);
    }
  };

  const saveCharacter = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Validate required fields
      if (!data.sections?.General?.name) {
        throw new Error("Character name is required");
      }

      const response = await fetch("/api/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to save character");
      }
      
      console.log("Character saved successfully:", result);
    } catch (err) {
      console.error("Error saving character:", err);
    }
  };

  const handleNextStep = () => {
    if (currentStep < config.sections.length - 1) {
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
      {currentSection.fields.map((field) => {
        const isAttribute = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"].includes(field.name);

        return (
          <div key={field.name} className={`character-form__field ${isAttribute ? "attribute-row" : ""}`}>
            <label htmlFor={field.name} className="character-form__label">{field.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={field.type || "text"}
              value={formData.sections[currentSection.name]?.[field.name] || ""}
              required={field.required || false}
              onChange={(e) => handleInputChange(e, field.name)}
              className="character-form__input"
              readOnly={field.readonly || false}
            />
            {isAttribute && (
              <>
                <input
                  type="text"
                  value={formData.sections[currentSection.name]?.[`${field.name}-modifier`] || ""}
                  readOnly
                  className="character-form__input modifier-input"
                  placeholder="Мод."
                />
                {field.rollable && field.formula && (
                  <button
                    type="button"
                    className="roll-button"
                    onClick={() => handleRoll(field.name, currentSection.name, field.formula)}
                  >
                    🎲 Roll
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}
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

export default DnDForm;
