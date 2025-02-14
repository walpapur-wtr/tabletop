const serverUrl = "http://127.1.3.202:3000/rolls";

const rollDice = async (formula) => {
  try {
    const rollData = parseFormula(formula);
    await sendRollDataToServer(rollData);
    return rollData;
  } catch (error) {
    console.error("Error performing roll: ", error);
    return null;
  }
};

const parseFormula = (formula) => {
  const advMatch = formula.match(/adv\((\d+d\d+)\)/);
  const disadvMatch = formula.match(/disadv\((\d+d\d+)\)/);

  if (advMatch) {
    return handleAdvantageRoll(advMatch[1]);
  } else if (disadvMatch) {
    return handleDisadvantageRoll(disadvMatch[1]);
  } else {
    return handleStandardRoll(formula);
  }
};

const handleStandardRoll = (formula) => {
  const parts = formula.split("+").map(part => part.trim());
  const rolls = parts.map(part => rollSingleDice(part));
  const total = rolls.reduce((sum, roll) => sum + roll.total, 0);

  return {
    formula,
    rolls: rolls.flatMap(roll => roll.rolls),
    total,
    date: new Date().toISOString(),
  };
};

const handleAdvantageRoll = (formula) => {
  const roll1 = rollSingleDice(formula);
  const roll2 = rollSingleDice(formula);
  const total = Math.max(roll1.total, roll2.total);

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
    rolls: rolls.map(value => ({ value })),
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
