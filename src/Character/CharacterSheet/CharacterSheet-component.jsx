import React from "react";
import "./CharacterSheet-styles.css";

const CharacterSheet = ({ character, config }) => {
  const getLabel = (sectionName, fieldName) => {
    const section = config.sections.find((sec) => sec.name === sectionName);
    if (section) {
      const field = section.fields.find((fld) => fld.name === fieldName);
      return field ? field.label : fieldName;
    }
    return fieldName;
  };

  const renderSection = (sectionName, sectionData) => (
    <div key={sectionName} className="character-sheet__section">
      <h3>{sectionName}</h3>
      {Object.entries(sectionData).map(([fieldName, fieldValue]) => (
        <p key={fieldName}>
          <strong>{getLabel(sectionName, fieldName)}:</strong> {fieldValue}
        </p>
      ))}
    </div>
  );

  return (
    <div className="character-sheet">
      <h2>{character.sections.General.name}</h2>
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
