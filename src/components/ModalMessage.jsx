import React from "react";
import "./ModalMessage-styles.css";

const ModalMessage = ({ message, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
          {onConfirm && <button onClick={onConfirm}>Log In</button>}
        </div>
      </div>
    </div>
  );
};

export default ModalMessage;
