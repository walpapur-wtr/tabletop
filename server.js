const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const jwt = require("jsonwebtoken"); // Add this line
const SECRET_KEY = "your_secret_key"; // Replace with a secure key

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.1.3.170";

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());
app.use(bodyParser.json());

const charactersDir = path.join(__dirname, "Characters");
const dataFilePath = path.join(__dirname, "RollData.json");

// MySQL Database connection
const db = mysql.createConnection({
    host: 'vz536877.mysql.tools', // replace with your database host
    user: 'vz536877_tabletoplogin', // replace with your database username
    password: 'HcE856-a;f', // replace with your database password
    database: 'vz536877_tabletoplogin', // replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1); // Завершити програму, якщо підключення не вдалося
    } else {
        console.log('Connected to MySQL database');
    }
});

// Middleware to verify token and extract username for protected routes
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.error("Invalid or expired token:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.username = user.username; // Attach username to the request
      next();
    });
  } else {
    console.warn("Authorization header missing");
    return res.status(401).json({ message: "Authorization header missing" });
  }
};

// Registration endpoint
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

    db.query(sql, [username, email, password], (err, results) => {
        if (err) {
            console.error('Помилка SQL-запиту:', err); // Додане логування помилки
            return res.status(500).json({ message: 'Помилка реєстрації', error: err });
        }
        console.log('Результати SQL-запиту:', results); // Логування результату для перевірки

        // Create a directory for the user
        const userDir = path.join(__dirname, "users", username);
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
            console.log(`Директорія для користувача ${username} створена.`);
        }

        res.status(201).json({ message: 'Користувач успішно зареєстрований' });
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, username, password } = req.body;

    let sql;
    let params;

    if (email) {
        sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
        params = [email, password];
    } else if (username) {
        sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
        params = [username, password];
    } else {
        return res.status(400).json({ message: 'Email або Username обов\'язкові для входу' });
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Помилка SQL-запиту:', err);
            return res.status(500).json({ message: 'Login failed' });
        }

        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" }); // Generate token
            res.json({ message: 'Login successful', token, username: user.username });
        } else {
            res.status(401).json({ message: 'Invalid email/username or password' });
        }
    });
});

// Перевіряємо, чи існує директорія для персонажів, і створюємо її, якщо її немає
if (!fs.existsSync(charactersDir)) {
  fs.mkdirSync(charactersDir);
}

// Public route to get all characters
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

// Public route to get a character by name
app.get("/api/characters/:name", (req, res) => {
  const characterName = decodeURIComponent(req.params.name);
  const characterFile = path.join(charactersDir, `${characterName}.json`);

  if (!fs.existsSync(characterFile)) {
    console.error(`Character not found: ${characterName}`);
    return res.status(404).json({ error: "Персонажа не знайдено." });
  }

  const characterData = JSON.parse(fs.readFileSync(characterFile, "utf-8"));
  res.status(200).json(characterData);
});

// Protected route to create a new character
app.post("/api/characters", verifyToken, (req, res) => {
  const { system, version, sections } = req.body;
  const username = req.username; // Get the logged-in user's username
  console.log("Received character creation request:", { system, version, sections, username });

  if (!username) {
    return res.status(401).json({ error: "Користувач не авторизований." });
  }

  if (!system || !version) {
    console.error("System or version not specified in request.");
    return res.status(400).json({ error: "Необхідно вказати систему та версію." });
  }

  if (!sections || !sections.General || !sections.General.name) {
    console.error("General section or name is missing.");
    return res.status(400).json({ error: "Поле General.name є обов'язковим." });
  }

  const configFilePath = path.join(__dirname, "configs", system, `${version}.json`);
  if (!fs.existsSync(configFilePath)) {
    console.error(`Config file not found: ${configFilePath}`);
    return res.status(400).json({ error: "Невідома система або версія." });
  }

  const newCharacter = {
    id: Date.now().toString(),
    user: username, // Add the username to the character data
    system,
    version,
    sections,
  };

  const characterFilePath = path.join(charactersDir, `${sections.General.name}.json`);
  fs.writeFileSync(characterFilePath, JSON.stringify(newCharacter, null, 2), "utf-8");
  console.log("Character saved successfully:", newCharacter);
  res.status(201).json({ message: "Персонаж створено.", character: newCharacter });
});

// Protected route to update a character
app.put("/api/characters/:name", verifyToken, (req, res) => {
  const characterName = decodeURIComponent(req.params.name);
  const characterFile = path.join(charactersDir, `${characterName}.json`);

  if (!fs.existsSync(characterFile)) {
    console.error(`Character not found: ${characterName}`);
    return res.status(404).json({ error: "Персонажа не знайдено." });
  }

  const { sections } = req.body;
  const characterData = JSON.parse(fs.readFileSync(characterFile, "utf-8"));

  characterData.sections = { ...characterData.sections, ...sections };

  fs.writeFileSync(characterFile, JSON.stringify(characterData, null, 2), "utf-8");
  console.log("Character updated successfully:", characterData);
  res.status(200).json({ message: "Персонаж оновлено.", character: characterData });
});

// Serve configuration files
app.get("/configs/:system.json", (req, res) => {
  const configFilePath = path.join(__dirname, "configs", `${req.params.system}.json`);
  console.log("Requested config file path:", configFilePath);

  if (!fs.existsSync(configFilePath)) {
    console.error("Configuration file not found:", configFilePath);
    return res.status(404).send("Configuration file not found");
  }

  console.log("Configuration file found:", configFilePath);
  res.sendFile(configFilePath);
});

app.get("/api/systems/:system/:version", (req, res) => {
  const { system, version } = req.params;
  const configPath = path.join(__dirname, "configs", system, `${version}.json`);

  console.log("Requested system:", system);
  console.log("Requested version:", version);
  console.log("Config file path:", configPath);

  if (!fs.existsSync(configPath)) {
    console.error("Configuration file not found:", configPath);
    return res.status(404).json({ error: "Configuration file not found" });
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  res.json(config);
});

// Endpoint to fetch configuration files with metadata
app.get("/api/configs", (req, res) => {
  const configsDir = path.join(__dirname, "configs");

  fs.readdir(configsDir, { withFileTypes: true }, (err, folders) => {
    if (err) {
      return res.status(500).json({ error: "Помилка читання директорії конфігурацій." });
    }

    const systems = folders
      .filter((folder) => folder.isDirectory()) // Перевіряємо, чи це папка
      .map((folder) => {
        const systemPath = path.join(configsDir, folder.name);
        const files = fs.readdirSync(systemPath).filter((file) => file.endsWith(".json"));

        return {
          system: folder.name,
          configs: files.map((file) => {
            const filePath = path.join(systemPath, file);
            const configData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            return {
              filename: file,
              name: configData.name || "Unknown",
              author: configData.author || "Unknown",
              basedOn: configData.basedOn || "Custom",
            };
          }),
        };
      });

    res.status(200).json(systems);
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
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ error: "Помилка читання файлу." });
    }

    let rollData = [];

    try {
      rollData = data ? JSON.parse(data) : [];
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
      
      console.log("Сервер отримав дані кидка:", rollData);
      res.status(200).json({ message: "Дані успішно збережено.", newRoll });
    });
  });
});

// Запуск сервера
app.listen(PORT, HOST, () => {
  console.log(`Сервер запущено на http://${HOST}:${PORT}`);
});
