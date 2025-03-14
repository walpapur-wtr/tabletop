// ModalMessage.js
import React from 'react';

const ModalMessage = ({ message, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>Закрити</button>
      </div>
    </div>
  );
};

export default ModalMessage;
