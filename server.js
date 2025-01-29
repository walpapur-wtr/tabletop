const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.1.3.202";

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());
app.use(bodyParser.json());

const charactersDir = path.join(__dirname, "Characters");
const dataFilePath = path.join(__dirname, "RollData.json");

// Перевіряємо, чи існує директорія для персонажів, і створюємо її, якщо її немає
if (!fs.existsSync(charactersDir)) {
  fs.mkdirSync(charactersDir);
}

// Отримати всіх персонажів
app.get("/api/characters", (req, res) => {
  fs.readdir(charactersDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Помилка читання директорії." });
    }

    const characters = files.map((file) => {
      const filePath = path.join(charactersDir, file);
      const characterData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return characterData;
    });

    res.status(200).json(characters);
  });
});

// Отримати персонажа за ім'ям
app.get("/api/characters/:name", (req, res) => {
  const characterName = decodeURIComponent(req.params.name);
  const characterFile = path.join(charactersDir, `${characterName}.json`);

  if (!fs.existsSync(characterFile)) {
    return res.status(404).json({ error: "Персонаж не знайдений." });
  }

  const characterData = JSON.parse(fs.readFileSync(characterFile, "utf-8"));
  res.status(200).json(characterData);
});

// Створити нового персонажа
app.post("/api/characters", (req, res) => {
  const { name, level, class: charClass, race, image, strength, dexterity, constitution, intelligence, wisdom, charisma } = req.body;

  if (!name || !level || !charClass || !race || !image ||
      strength === undefined || dexterity === undefined || constitution === undefined ||
      intelligence === undefined || wisdom === undefined || charisma === undefined) {
    return res.status(400).json({ error: "Неправильний формат даних." });
  }

  const newCharacter = {
    id: Date.now().toString(),
    name,
    level,
    class: charClass,
    race,
    image,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma
  };

  const characterFilePath = path.join(charactersDir, `${name}.json`);

  fs.writeFile(characterFilePath, JSON.stringify(newCharacter, null, 2), "utf-8", (err) => {
    if (err) {
      return res.status(500).json({ error: "Помилка запису у файл." });
    }
    res.status(201).json({ message: "Персонаж створено.", character: newCharacter });
  });
});

// Обробка всіх інших маршрутів (для React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Маршрут для прийому даних
app.post("/rolls", (req, res) => {
  const { formula, rolls, total } = req.body;

  if (!formula || !Array.isArray(rolls) || total === undefined) {
    return res.status(400).json({ error: "Неправильний формат даних." });
  }

  const newRoll = {
    formula,
    rolls,
    total,
    date: new Date().toISOString(),
  };

  // Читаємо поточні дані з файлу
  fs.readFile(dataFilePath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Помилка читання файлу." });
    }

    let rollData = [];

    try {
      rollData = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).json({ error: "Помилка парсингу файлу." });
    }

    // Додаємо новий кидок
    rollData.push(newRoll);

    // Записуємо оновлені дані в файл
    fs.writeFile(dataFilePath, JSON.stringify(rollData, null, 2), "utf-8", (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ error: "Помилка запису у файл." });
      }

      res.status(200).json({ message: "Дані успішно збережено.", newRoll });
    });
  });
});

// Запуск сервера
app.listen(PORT, HOST, () => {
  console.log(`Сервер запущено на http://${HOST}:${PORT}`);
});
