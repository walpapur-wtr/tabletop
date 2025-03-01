import React from "react";
import "./CharacterSheet-styles.css";

const CharacterSheet = ({ character }) => {
  const renderSection = (sectionName, sectionData) => (
    <div key={sectionName} className="character-sheet__section">
      <h3>{sectionName}</h3>
      {Object.entries(sectionData).map(([fieldName, fieldValue]) => (
        <p key={fieldName}>
          <strong>{fieldName}:</strong> {fieldValue}
        </p>
      ))}
    </div>
  );

  console.log("Character sections:", character.sections);

  return (
    <div className="character-sheet">
      <h2>{character.name}</h2>
      {character.sections && Object.keys(character.sections).length > 0 ? (
        Object.entries(character.sections).map(([sectionName, sectionData]) =>
          renderSection(sectionName, sectionData)
        )
      ) : (
        <p>No sections available</p>
      )}
    </div>
  );
};

export default CharacterSheet;
