const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.1.3.202";

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

// Директорія для збереження персонажів
const charactersDir = path.join(__dirname, "Characters");

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Перевіряємо, чи існує директорія для персонажів, і створюємо її, якщо її немає
if (!fs.existsSync(charactersDir)) {
  fs.mkdirSync(charactersDir);
}

// Обробник для отримання всіх персонажів
app.get("/api/characters", (req, res) => {
  fs.readdir(charactersDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Помилка читання директорії." });
    }

    const characters = files.map((file) => {
      const filePath = path.join(charactersDir, file);
      const characterData = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(characterData);
    });

    res.status(200).json(characters);
  });
});

// Обробник для створення нового персонажа
app.post("/api/characters", (req, res) => {
  const { name, level, class: charClass, race, image } = req.body;

  if (!name || !level || !charClass || !race || !image) {
    return res.status(400).json({ error: "Неправильний формат даних." });
  }

  const newCharacter = {
    id: Date.now().toString(), // Унікальний ID
    name,
    level,
    class: charClass,
    race,
    image,
  };

  const characterFilePath = path.join(charactersDir, `${newCharacter.id}.json`);

  fs.writeFile(
    characterFilePath,
    JSON.stringify(newCharacter, null, 2),
    "utf-8",
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Помилка запису у файл." });
      }
      res.status(201).json({ message: "Персонаж створено.", character: newCharacter });
    }
  );
});

// Запуск сервера
app.listen(PORT, HOST, () => {
  console.log(`Сервер запущено на http://${HOST}:${PORT}`);
});
