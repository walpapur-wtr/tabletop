import React, { useState } from "react";

const CustomForm = ({ sections }) => {
  const [formData, setFormData] = useState({});

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

  const saveCharacter = () => {
    const token = localStorage.getItem("token"); // Retrieve token
    fetch("/api/characters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token in the header
      },
      body: JSON.stringify({
        system: "custom",
        sections: formData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Character saved:", data);
        window.location.href = `/character/${data.character.id}`;
      })
      .catch((err) => console.error("Error saving character:", err));
  };

  return (
    <div className="custom-form">
      {sections.map((section) => (
        <div key={section.name} className="custom-form__section">
          <h2>{section.name}</h2>
          {section.fields.map((field) => (
            <div key={field.name} className="custom-form__field">
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[section.name]?.[field.name] || ""}
                onChange={(e) => handleInputChange(e, section.name)}
                required={field.required}
              />
            </div>
          ))}
        </div>
      ))}
      <div className="custom-form__navigation">
        <button onClick={saveCharacter} className="save-button">
          Зберегти
        </button>
      </div>
    </div>
  );
};

export default CustomForm;
