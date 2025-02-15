import React, { useState } from "react";
import { FaDiceD20 } from "react-icons/fa";
import RollHistoryComponent from "./RollStats/RollHistory-component";
import "./DiceRoller-styles.css";
import { rollDice } from "./Roll-script";

const DiceRollerComponent = () => {
  const [modifier, setModifier] = useState(0);
  const [customFormula, setCustomFormula] = useState("");
  const [lastRoll, setLastRoll] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryVisible, setHistoryVisible] = useState(false);

  const addDiceToFormula = (diceType) => {
    setCustomFormula((prev) => {
      const regex = new RegExp(`(\\d*)${diceType}`);
      const match = prev.match(regex);

      if (match) {
        const count = parseInt(match[1] || "1", 10) + 1;
        return prev.replace(regex, `${count}${diceType}`);
      } else {
        return prev ? `${prev} + 1${diceType}` : `1${diceType}`;
      }
    });
  };

  const handleRoll = async () => {
    if (!customFormula) return;

    let formula = customFormula;
    if (modifier) formula += ` + ${modifier}`;

    try {
      const rollData = await rollDice(formula);
      if (rollData) {
        setLastRoll(rollData);
        setHistory((prev) => [rollData, ...prev]);
        setCustomFormula(""); // Clear formula after rolling
      }
    } catch (error) {
      alert(error.message); // Display error to the user
    }
  };

  const handleAdvantageRoll = () => {
    let formula = customFormula || "1d20";
    formula = formula.replace(/adv\(([^)]+)\)|disadv\(([^)]+)\)/, "$1$2");
    setCustomFormula(`adv(${formula})`);
  };

  const handleDisadvantageRoll = () => {
    let formula = customFormula || "1d20";
    formula = formula.replace(/adv\(([^)]+)\)|disadv\(([^)]+)\)/, "$1$2");
    setCustomFormula(`disadv(${formula})`);
  };

  const repeatLastRoll = async () => {
    if (!lastRoll) return;

    const rollData = await rollDice(lastRoll.formula);
    if (rollData) {
      setLastRoll(rollData);
      setHistory((prev) => [rollData, ...prev]);
    }
  };

  const deleteRoll = (index) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  };

  const updateModifier = (newModifier) => {
    setModifier(newModifier);
  };

  return (
    <div className="dice-roller">

      <div className="dice-roller__dice-buttons">
        {["d4", "d6", "d8", "d10", "d12", "d20", "d100"].map((dice) => (
          <button
            className="dice-roller__dice-button"
            key={dice}
            onClick={() => addDiceToFormula(dice)}
          >
            <FaDiceD20 /> {dice}
          </button>
        ))}
      </div>

      <div className="dice-roller__modifier">
        <div className="dice-roller__modifier-controls">
          <div className="dice-roller__adv-dis-buttons">
            <button
              className="dice-roller__advantage-button"
              onClick={handleAdvantageRoll}
            >
              Перевага
            </button>
            <button
              className="dice-roller__disadvantage-button"
              onClick={handleDisadvantageRoll}
            >
             Перешкода
            </button>
            </div>
          <div className="dice-roller__modifier-buttons">
            <button
               className="dice-roller__modifier-button"
              onClick={() => updateModifier(modifier - 1)}
             >
              -1
             </button>
            <button
               className="dice-roller__modifier-button"
               onClick={() => updateModifier(modifier + 1)}
             >
               +1
             </button>
          </div>
        </div>
      
        <div className="dice-roller__modifier-formula">
          <input
            className="dice-roller__formula-field"
            type="text"
            value={customFormula}
            onChange={(e) => setCustomFormula(e.target.value)}
            placeholder="Наприклад: 2d6 + 3"
          />
          <input
            className="dice-roller__modifier-field"
            type="text"
            value={modifier}
            onChange={(e) => updateModifier(parseInt(e.target.value, 10) || 0)}
            placeholder="0"
            />
        </div>
      </div>

      <div className="dice-roller__actions">
        <button className="dice-roller__roll-button" onClick={handleRoll}>
          Здійснити кидок
        </button>
      </div>

      {lastRoll && (
        <div className="dice-roller__last-roll">
          <p>Результат останнього кидка:</p>
          <div className="dice-roller__last-roll-section">
            <strong className="dice-roller__last-roll-result">
              {lastRoll.total}
            </strong>
            <div className="dice-roller__last-roll-buttons">
              <button
                className="dice-roller__reroll-button"
                onClick={repeatLastRoll}
              >
                Повторити кидок
              </button>
              <button
                className="dice-roller__history-button"
                onClick={() => setHistoryVisible(true)}
              >
                Історія кидків
              </button>
            </div>
          </div>
        </div>
      )}

      {isHistoryVisible && (
        <div className="roll-history-popup">
          <button className="close-popup" onClick={() => setHistoryVisible(false)}>
            ✖
          </button>
          <RollHistoryComponent
            history={history}
            onDelete={deleteRoll}
            onRepeat={repeatLastRoll}
          />
        </div>
      )}
    </div>
  );
};

export default DiceRollerComponent;
