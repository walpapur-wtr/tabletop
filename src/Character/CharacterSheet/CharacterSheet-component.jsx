import React from "react";
import "./CharacterSheet-styles.css";

const CharacterSheet = ({ character }) => {
  const renderSection = (section) => (
    <div key={section.name} className="character-sheet__section">
      <h3>{section.name}</h3>
      {section.fields.map((field) => (
        <p key={field.name}>
          <strong>{field.label}:</strong> {character[field.name]}
        </p>
      ))}
    </div>
  );

  return (
    <div className="character-sheet">
      <h2>{character.name}</h2>
      {character.sections.map(renderSection)}
    </div>
  );
};

export default CharacterSheet;
