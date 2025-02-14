import React from "react";
import "./RollHistory-styles.css";

const RollHistoryComponent = ({ history, onDelete, onRepeat }) => {
  return (
    <div className="roll-history">
      <table className="roll-history__table">
        <thead>
          <tr>
            <th>Дата і Формула</th>
            <th>Загальний результат</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {history.map((roll, index) => (
            <tr key={index}>
              <td>
                <div>{new Date(roll.date).toLocaleString()}</div>
                <div>{roll.formula}</div>
                <div>{roll.rolls.map(r => r.value).join(", ")}</div>
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