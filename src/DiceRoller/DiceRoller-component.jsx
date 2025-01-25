import React, { useState } from "react";
import { DiceRoller } from "rpg-dice-roller";
import { FaDiceD20 } from "react-icons/fa";
import "./DiceRoller-styles.css";

const DiceRollerComponent = () => {
  const [modifier, setModifier] = useState(0);
  const [customFormula, setCustomFormula] = useState("");
  const [lastRoll, setLastRoll] = useState(null);
  const roller = new DiceRoller();

  const addDiceToFormula = (diceType) => {
    setCustomFormula((prev) => (prev ? `${prev} + ${diceType}` : diceType));
  };

  const sendRollToServer = async (rollData) => {
    try {
      await fetch("http://127.1.3.202:3000/rolls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rollData),
      });
    } catch (error) {
      console.error("Помилка при відправці даних на сервер:", error);
    }
  };

  const handleRoll = () => {
    if (!customFormula) return;

    let formula = customFormula;
    if (modifier) formula += `${modifier >= 0 ? " + " : " "}${modifier}`;

    try {
      const roll = roller.roll(formula);
      const rollData = {
        formula: roll.notation,
        rolls: roll.rolls.flat(),
        total: roll.total,
      };
      setLastRoll(rollData);
      sendRollToServer(rollData);
      setCustomFormula(""); // Clear formula after rolling
    } catch (error) {
      console.error("Error performing roll: ", error);
    }
  };

  const handleAdvantageRoll = () => {
    try {
      const roll = roller.roll("2d20kh1");
      const rollData = {
        formula: "Кидок з перевагою (2d20kh1)",
        rolls: roll.rolls.flat(),
        total: roll.total,
      };
      setLastRoll(rollData);
      sendRollToServer(rollData);
    } catch (error) {
      console.error("Error performing advantage roll: ", error);
    }
  };

  const handleDisadvantageRoll = () => {
    try {
      const roll = roller.roll("2d20kl1");
      const rollData = {
        formula: "Кидок з перешкодою (2d20kl1)",
        rolls: roll.rolls.flat(),
        total: roll.total,
      };
      setLastRoll(rollData);
      sendRollToServer(rollData);
    } catch (error) {
      console.error("Error performing disadvantage roll: ", error);
    }
  };

  const repeatLastRoll = () => {
    if (!lastRoll) return;

    try {
      const roll = roller.roll(lastRoll.formula);
      const rollData = {
        formula: roll.notation,
        rolls: roll.rolls.flat(),
        total: roll.total,
      };
      setLastRoll(rollData);
      sendRollToServer(rollData);
    } catch (error) {
      console.error("Error repeating roll: ", error);
    }
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
            onChange={(e) => setModifier(parseInt(e.target.value, 10) || 0)}
            placeholder="0"
          />
          <button
            className="dice-roller__modifier-button"
            onClick={() => setModifier((prev) => prev - 1)}
          >
            -1
          </button>
          <button
            className="dice-roller__modifier-button"
            onClick={() => setModifier((prev) => prev + 1)}
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
          <p>
            Результат останнього кидка: 
          </p>
          <div className="dice-roller__last-roll-section" >
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
              onClick={repeatLastRoll}
            >
              Історія кидків
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRollerComponent;
