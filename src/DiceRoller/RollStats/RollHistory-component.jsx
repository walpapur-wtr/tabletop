import React from "react";
import "./RollHistory-styles.css";

const RollHistoryComponent = ({ history, onDelete, onRepeat, onClose }) => {
  return (
    <div className="roll-history">
      <button className="close-table" onClick={onClose}>✖</button>
      <table className="roll-history__table">
        <thead>
          <tr>
            <th>Формула</th>
            <th>Результат</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {history.map((roll, index) => (
            <tr key={index}>
              <td>
                <div>{roll.formula}</div>
              </td>
              <td>{roll.total}</td>
              <td>
                <button onClick={() => onRepeat(roll)}>Повторити</button>
                <button onClick={() => onDelete(index)}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RollHistoryComponent;