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
    if (modifier) formula += `${modifier >= 0 ? " + " : " "}${modifier}`;

    const rollData = await rollDice(formula);
    if (rollData) {
      setLastRoll(rollData);
      setHistory((prev) => [rollData, ...prev]);
      setCustomFormula(""); // Clear formula after rolling
    }
  };

  const handleAdvantageRoll = async () => {
    const rollData = await rollDice("2d20kh1");
    if (rollData) {
      setLastRoll(rollData);
      setHistory((prev) => [rollData, ...prev]);
    }
  };

  const handleDisadvantageRoll = async () => {
    const rollData = await rollDice("2d20kl1");
    if (rollData) {
      setLastRoll(rollData);
      setHistory((prev) => [rollData, ...prev]);
    }
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
    setCustomFormula((prev) => {
      const formulaWithoutModifier = prev.replace(/ \+ \d+$/, "").replace(/ - \d+$/, "");
      return formulaWithoutModifier;
    });
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
        <label className="dice-roller__label">Модифікатор:</label>
        <div className="dice-roller__modifier-controls">
          <input
            className="dice-roller__modifier-field"
            type="text"
            value={modifier}
            onChange={(e) => updateModifier(parseInt(e.target.value, 10) || 0)}
            placeholder="0"
          />
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

      <div className="dice-roller__formula">
        <label className="dice-roller__label">Формула:</label>
        <input
          className="dice-roller__formula-field"
          type="text"
          value={customFormula}
          onChange={(e) => setCustomFormula(e.target.value)}
          placeholder="Наприклад: 2d6 + 3"
        />
      </div>

      <div className="dice-roller__actions">
        <button className="dice-roller__roll-button" onClick={handleRoll}>
          Здійснити кидок
        </button>
        <div className="dice-roller__adv-dis-buttons">
          <button
            className="dice-roller__advantage-button"
            onClick={handleAdvantageRoll}
          >
            Кидок з перевагою
          </button>
          <button
            className="dice-roller__disadvantage-button"
            onClick={handleDisadvantageRoll}
          >
            Кидок з перешкодою
          </button>
        </div>
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
