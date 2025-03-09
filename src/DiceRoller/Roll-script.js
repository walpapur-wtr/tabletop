const serverUrl = "http://127.1.3.170:3000/rolls";

const rollDice = async (formula) => {
  try {
    const rollData = parseFormula(formula);
    console.log(`Скрипт отримав формулу: ${formula}`);
    await sendRollDataToServer(rollData);
    return rollData;
  } catch (error) {
    console.error("Error performing roll: ", error);
    return null;
  }
};

const parseFormula = (formula) => {
  const disadvMatch = formula.match(/disadv\(([^)]+)\)/);
  const advMatch = formula.match(/adv\(([^)]+)\)/);

  if (disadvMatch) {
    console.log(`Формула визначена як перешкода: ${disadvMatch[1]}`);
    validateAdvDisadvFormula(disadvMatch[1]);
    return handleAdvDisadvRoll(disadvMatch[1], "disadv", formula);
  } else if (advMatch) {
    console.log(`Формула визначена як перевага: ${advMatch[1]}`);
    validateAdvDisadvFormula(advMatch[1]);
    return handleAdvDisadvRoll(advMatch[1], "adv", formula);
  } else {
    console.log(`Формула визначена як стандартна: ${formula}`);
    return handleStandardRoll(formula);
  }
};

const handleAdvDisadvRoll = (mainFormula, type, fullFormula) => {
  const additionalParts = fullFormula.replace(`${type}(${mainFormula})`, "").split("+").map(part => part.trim()).filter(Boolean);
  const mainRoll = type === "adv" ? handleAdvantageRoll(mainFormula) : handleDisadvantageRoll(mainFormula);
  const additionalRolls = additionalParts.map(part => handleStandardRoll(part));

  const total = additionalRolls.reduce((sum, roll) => sum + roll.total, mainRoll.total);
  const rolls = [mainRoll, ...additionalRolls].flatMap(roll => roll.rolls);

  return {
    formula: fullFormula,
    rolls,
    total,
    date: new Date().toISOString(),
  };
};

const validateAdvDisadvFormula = (formula) => {
  const parts = formula.split("+").map(part => part.trim());
  const diceParts = parts.filter(part => part.includes("d"));

  if (diceParts.length !== 1) {
    throw new Error("Формула некоректна, використовуйте лише 1 тип кубиків при кидку переваги чи перешкоди");
  }
};

const handleStandardRoll = (formula) => {
  const parts = formula.split("+").map(part => part.trim());
  const rolls = [];
  let total = 0;

  parts.forEach(part => {
    if (part.includes("d")) {
      const roll = rollSingleDice(part);
      rolls.push(...roll.rolls);
      total += roll.total;
    } else {
      const modifier = parseInt(part, 10);
      total += modifier;
      rolls.push({ value: modifier, isModifier: true });
    }
  });

  return {
    formula,
    rolls,
    total,
    date: new Date().toISOString(),
  };
};

const handleAdvantageRoll = (formula) => {
  const roll1 = rollSingleDice(formula);
  const roll2 = rollSingleDice(formula);
  const total = Math.max(roll1.total, roll2.total);

  console.log(`Функція переваги: roll1 = ${roll1.total}, roll2 = ${roll2.total}, total = ${total}`);

  return {
    formula: `adv(${formula})`,
    rolls: [...roll1.rolls, ...roll2.rolls],
    total,
    date: new Date().toISOString(),
  };
};

const handleDisadvantageRoll = (formula) => {
  const roll1 = rollSingleDice(formula);
  const roll2 = rollSingleDice(formula);
  const total = Math.min(roll1.total, roll2.total);

  console.log(`Функція перешкоди: roll1 = ${roll1.total}, roll2 = ${roll2.total}, total = ${total}`);

  return {
    formula: `disadv(${formula})`,
    rolls: [...roll1.rolls, ...roll2.rolls],
    total,
    date: new Date().toISOString(),
  };
};

const rollSingleDice = (formula) => {
  const [count, sides] = formula.split("d").map(Number);
  const rolls = Array.from({ length: count }, () => getRandomInt(1, sides));
  const total = rolls.reduce((sum, roll) => sum + roll, 0);

  return {
    rolls: rolls.map(value => ({ value, dice: `d${sides}` })),
    total,
  };
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const sendRollDataToServer = async (rollData) => {
  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rollData),
    });

    if (!response.ok) {
      throw new Error("Failed to send roll data to server");
    }
  } catch (error) {
    console.error("Error sending roll data to server: ", error);
  }
};

module.exports = { rollDice };
