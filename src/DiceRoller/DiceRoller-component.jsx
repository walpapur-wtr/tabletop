import React, { useState } from "react";
import RollHistoryComponent from "./RollStats/RollHistory-component";
import "./DiceRoller-styles.css";
import { rollDice } from "./Roll-script";
import { ReactComponent as DiceBlack16D4 } from "./assets/dice-b16-d4.svg";
import { ReactComponent as DiceOrange32D4 } from "./assets/dice-o32-d4.svg";
import { ReactComponent as DiceBlack16D6 } from "./assets/dice-b16-d6.svg";
import { ReactComponent as DiceOrange32D6 } from "./assets/dice-o32-d6.svg";
import { ReactComponent as DiceBlack16D8 } from "./assets/dice-b16-d8.svg";
import { ReactComponent as DiceOrange32D8 } from "./assets/dice-o32-d8.svg";
import { ReactComponent as DiceBlack16D10 } from "./assets/dice-b16-d10.svg";
import { ReactComponent as DiceOrange32D10 } from "./assets/dice-o32-d10.svg";
import { ReactComponent as DiceBlack16D12 } from "./assets/dice-b16-d12.svg";
import { ReactComponent as DiceOrange32D12 } from "./assets/dice-o32-d12.svg";
import { ReactComponent as DiceBlack16D20 } from "./assets/dice-b16-d20.svg";
import { ReactComponent as DiceOrange32D20 } from "./assets/dice-o32-d20.svg";


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

  const getDiceIconWithResult = (dice, result) => {
  if (!dice || result === undefined) {
    return null;
  }

  const sides = parseInt(dice.replace("d", ""), 10);
  const icon = sides <= 4 ? <DiceOrange32D4 /> :
               sides <= 6 ? <DiceOrange32D6 /> :
               sides <= 8 ? <DiceOrange32D8 /> :
               sides <= 10 ? <DiceOrange32D10 /> :
               sides <= 12 ? <DiceOrange32D12 /> :
               sides <= 20 ? <DiceOrange32D20 /> :
               <>
                 <DiceOrange32D10 /> <DiceOrange32D10 />
               </>;

  return (
    <div className="dice-icon-with-result">
      {icon}
      <span className="dice-result">{result}</span>
    </div>
  );
};

  return (
    <div className="dice-roller">

      <div className="dice-roller__dice-buttons">
        <button
          className="dice-roller__dice-button"
          onClick={() => addDiceToFormula("d4")}
        >
          <DiceBlack16D4 /> d4
        </button>
        <button
          className="dice-roller__dice-button"
          onClick={() => addDiceToFormula("d6")}
        >
          <DiceBlack16D6 /> d6
        </button>
        <button
          className="dice-roller__dice-button"
          onClick={() => addDiceToFormula("d8")}
        >
          <DiceBlack16D8 /> d8
        </button>
        <button
          className="dice-roller__dice-button"
          onClick={() => addDiceToFormula("d10")}
        >
          <DiceBlack16D10 /> d10
        </button>
        <button
          className="dice-roller__dice-button"
          onClick={() => addDiceToFormula("d12")}
        >
          <DiceBlack16D12 /> d12
        </button>
        <button
          className="dice-roller__dice-button"
          onClick={() => addDiceToFormula("d20")}
        >
          <DiceBlack16D20 /> d20
        </button>
        <button
          className="dice-roller__dice-button"
          onClick={() => addDiceToFormula("d100")}
        >
          <DiceBlack16D10 /> <DiceBlack16D10 /> d100
        </button>
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
    <div className="dice-roller__last-roll-details">
      {lastRoll.rolls.map((roll, index) => (
        <span key={index} className="dice-roller__roll-item">
          {roll.isModifier ? (
            `m: ${roll.value}`
          ) : (
            <>
              {getDiceIconWithResult(roll.dice, roll.value)}
            </>
          )}
          {index < lastRoll.rolls.length - 1 && ", "}
        </span>
      ))}
    </div>
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
            onClose={() => setHistoryVisible(false)}
          />
        </div>
      )}
    </div>
  );
};

export default DiceRollerComponent;
