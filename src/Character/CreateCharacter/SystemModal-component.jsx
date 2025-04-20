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
            <li key={system.system} className="system-modal__item">
              <strong>{system.system}</strong>
              <ul className="system-modal__sublist">
                {system.configs.map((config) => (
                  <li
                    key={config.filename}
                    className="system-modal__subitem"
                    onClick={() => onSystemSelect(system.system, config.filename.replace(".json", ""))}
                  >
                    {config.name} ({config.version})
                  </li>
                ))}
              </ul>
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
