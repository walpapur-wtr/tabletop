import React, { useEffect, useState } from "react";
import "./SystemModal-styles.css";

const SystemModal = ({ onClose, onSystemSelect }) => {
  const [systems, setSystems] = useState([]);

  useEffect(() => {
    fetch("/api/configs")
      .then((res) => res.json())
      .then((data) => setSystems(data))
      .catch((err) => console.error("Error loading systems:", err));
  }, []);

  return (
    <div className="system-modal">
      <div className="system-modal__content">
        <h3 className="system-modal__title">Виберіть систему</h3>
        <ul className="system-modal__list">
          {systems.map((system) => (
            <li
              key={system.filename}
              className="system-modal__item"
              onClick={() => onSystemSelect(system.filename, system.basedOn)}
            >
              <strong>{system.name}</strong> by {system.author} (Based on: {system.basedOn})
            </li>
          ))}
        </ul>
        <button className="system-modal__close" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
};

export default SystemModal;
