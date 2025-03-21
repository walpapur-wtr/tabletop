import React, { useState, useEffect } from "react";

const DnDForm = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetch("/configs/dnd.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load configuration");
        }
        return res.json();
      })
      .then((data) => setSections(data.sections))
      .catch((err) => console.error(err));
  }, []);

  return (
    <form>
      {sections.map((section) => (
        <div key={section.name}>
          <h3>{section.name}</h3>
          {section.fields.map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              <input type={field.type} name={field.name} required={field.required} />
            </div>
          ))}
        </div>
      ))}
    </form>
  );
};

export default DnDForm;