const express = require("express");
const fs = require("fs").promises;
const fsSync = require("fs");  // Для синхронних операцій
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require('mysql2');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const SALT_ROUNDS = 10;

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.1.3.170";

// Database configuration
const dbConfig = {
    host: 'vz536877.mysql.tools',  // Замініть на ваш хост
    user: 'vz536877_tabletoplogin',           // Замініть на вашого користувача
    password: 'HcE856-a;f',              // Замініть на ваш пароль
    database: 'vz536877_tabletoplogin'        // Замініть на вашу базу даних
};

// Create MySQL connection with auto-reconnect
let connection;

function handleDisconnect() {
    connection = mysql.createConnection(dbConfig);
    connection.connect(err => {
        if (err) {
            console.error('Error connecting to database:', err);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Connected to database successfully');
        }
    });

    connection.on('error', err => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || 
            err.code === 'ECONNREFUSED' || 
            err.code === 'ETIMEDOUT') {
            console.log('Trying to reconnect to database...');
            setTimeout(handleDisconnect, 2000);
        } else {
            console.error('Unhandled database error:', err);
            // Не кидаємо помилку, щоб сервер продовжував працювати
        }
    });
}

handleDisconnect();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use(express.json());
app.use(bodyParser.json());

// Directory constants
const USERS_DIR = path.join(__dirname, "users");

// Ensure base directories exist
(async () => {
    try {
        await fs.mkdir(USERS_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating base directory:', error);
    }
})();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Authorization header missing" 
        });
    }
    
    try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user; // Store the entire user object
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(403).json({ 
            success: false, 
            message: "Invalid or expired token",
            details: err.message 
        });
    }
    }

// Функція для створення стандартних налаштувань користувача
const defaultUserSettings = {
    theme: 'light',
    language: 'uk',
    notifications: true,
    diceRoller: {
        sound: true,
        animation: true,
        lastUsedDice: 'd20'
    },
    interface: {
        fontSize: 'medium',
        contrast: 'normal',
        compactMode: false
    },
    gameSystem: {
        default: 'dnd5e',
        customRules: {}
    },
    display: {
        showToolTips: true,
        showHotkeys: true
    },
    lastAccess: new Date().toISOString()
};

// Endpoint для отримання налаштувань користувача
app.get('/api/user/settings', verifyToken, async (req, res) => {
    try {
        const userSettingsPath = path.join(USERS_DIR, req.username, 'settings.json');
        
        let settings;
        try {
            const data = await fs.readFile(userSettingsPath, 'utf-8');
            settings = JSON.parse(data);
        } catch (error) {
            // Якщо файл не існує або пошкоджений, створюємо новий з дефолтними налаштуваннями
            settings = defaultUserSettings;
            await fs.writeFile(userSettingsPath, JSON.stringify(settings, null, 2));
        }
        
        res.json(settings);
    } catch (error) {
        console.error('Error reading user settings:', error);
        res.status(500).json({ message: 'Error reading user settings' });
    }
});

// Endpoint для оновлення налаштувань користувача
app.patch('/api/user/settings', verifyToken, async (req, res) => {
    try {
        const userSettingsPath = path.join(USERS_DIR, req.username, 'settings.json');
        const updates = req.body;
        
        // Отримуємо поточні налаштування
        let currentSettings;
        try {
            const data = await fs.readFile(userSettingsPath, 'utf-8');
            currentSettings = JSON.parse(data);
        } catch (error) {
            currentSettings = defaultUserSettings;
        }
        
        // Оновлюємо налаштування (глибоке об'єднання)
        const updatedSettings = deepMerge(currentSettings, updates);
        updatedSettings.lastAccess = new Date().toISOString();
        
        // Зберігаємо оновлені налаштування
        await fs.writeFile(userSettingsPath, JSON.stringify(updatedSettings, null, 2));
        
        res.json(updatedSettings);
    } catch (error) {
        console.error('Error updating user settings:', error);
        res.status(500).json({ message: 'Error updating user settings' });
    }
});

// Функція для глибокого об'єднання об'єктів
function deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
        if (source[key] instanceof Object && key in target) {
            result[key] = deepMerge(target[key], source[key]);
        } else {
            result[key] = source[key];
        }
    }
    
    return result;
}

// Registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Check if user exists
        connection.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Registration error' });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: 'Username or email already exists' });
            }

            // Create user in database
            connection.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                [username, email, hashedPassword], 
                async (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ message: 'Registration error' });
                    }

                    try {
                        // Create user directories
                        const userDir = path.join(USERS_DIR, username);
                        const charactersDir = path.join(userDir, "characters");
                        
                        await fs.mkdir(userDir, { recursive: true });
                        await fs.mkdir(charactersDir, { recursive: true });
                        
                        // Create initial roll history file
                        await fs.writeFile(
                            path.join(userDir, 'roll_history.json'),
                            JSON.stringify({ rolls: [] }, null, 2)
                        );

                        // Copy template files if they exist
                        const templateDir = path.join(__dirname, "Characters");
                        try {
                            await fs.access(templateDir);
                            await fs.copyFile(
                                path.join(templateDir, "Modifiers.json"),
                                path.join(charactersDir, "Modifiers.json")
                            );
                            await fs.copyFile(
                                path.join(templateDir, "Styles.json"),
                                path.join(charactersDir, "Styles.json")
                            );
                        } catch (error) {
                            console.log('Template directory or files not found, skipping...');
                        }

                        // Створюємо файл налаштувань
                        const settingsPath = path.join(userDir, 'settings.json');
                        await fs.writeFile(settingsPath, JSON.stringify(defaultUserSettings, null, 2));

                        res.status(201).json({ message: 'User registered successfully' });
                    } catch (error) {
                        console.error('Error creating user directories:', error);
                        res.status(500).json({ message: 'Error creating user directories' });
                    }
                }
            );
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, username, password } = req.body;

    let sql, params;
    if (email) {
        sql = 'SELECT * FROM users WHERE email = ?';
        params = [email];
    } else if (username) {
        sql = 'SELECT * FROM users WHERE username = ?';
        params = [username];
    } else {
        return res.status(400).json({ 
            success: false, 
            message: 'Email or Username required' 
        });
    }

    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(sql, params, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!results || results.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const userData = results[0];
        const validPassword = await bcrypt.compare(password, userData.password);
        
        if (!validPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid password' 
            });
        }

        const authToken = jwt.sign({ 
            username: userData.username,
            email: userData.email,
            userId: userData.id
        }, SECRET_KEY, { 
            expiresIn: "24h" 
        });

        console.log('User logged in:', { 
            username: userData.username, 
            email: userData.email 
        });

        res.json({
            success: true,
            message: 'Login successful',
            token: authToken,
            username: userData.username,
            email: userData.email
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Login failed',
            details: error.message 
        });
    }
});

// Get all characters for user
app.get('/api/characters', verifyToken, async (req, res) => {
    try {
        if (!req.user?.username) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated properly'
            });
        }

        console.log('Fetching characters for user:', req.user.username);
        const userCharactersDir = path.join(__dirname, 'users', req.user.username, "characters");
        console.log('Looking in directory:', userCharactersDir);
        
        // Check if directory exists
        if (!fsSync.existsSync(userCharactersDir)) {
            console.log('No characters directory found, returning empty list');
            return res.json({ 
                success: true, 
                characters: [] 
            });
        }

        // Read directory contents
        const files = await fs.readdir(userCharactersDir);
        console.log('Found files:', files);
        
        // Process each character file
        const characters = await Promise.all(
            files
                .filter(file => file.endsWith('.json') && !['Modifiers.json', 'Styles.json'].includes(file))
                .map(async file => {
                    try {
                        const data = await fs.readFile(path.join(userCharactersDir, file), 'utf8');
                        return JSON.parse(data);
                    } catch (error) {
                        console.error('Error reading character file:', file, error);
                        return null;
                    }
                })
        );
        
        // Filter out any failed reads
        const validCharacters = characters.filter(char => char !== null);
        console.log('Successfully loaded characters:', validCharacters.length);
        
        res.json({ 
            success: true, 
            characters: validCharacters 
        });
    } catch (error) {
        console.error('Error reading characters:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error reading characters',
            details: error.message 
        });
    }
});

// Helper for validating character data
const validateCharacterData = (data) => {
    const errors = [];
    if (!data.system) {
        errors.push('System is required');
    }
    if (!data.sections?.General?.name) {
        errors.push('Character name is required');
    }
    return errors;
};
  
  // Update character saving endpoint
  app.post('/api/characters', verifyToken, async (req, res) => {
    try {
        const characterData = req.body;
        
        // Validate character data
        const validationErrors = validateCharacterData(characterData);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid character data', 
                errors: validationErrors 
            });
        }

        const username = req.user.username;
        const userDir = path.join(__dirname, 'users', username);
        const charactersDir = path.join(userDir, 'characters');
  
        // Create directories if needed
        if (!fsSync.existsSync(userDir)) {
            await fs.mkdir(userDir);
        }
        if (!fsSync.existsSync(charactersDir)) {
            await fs.mkdir(charactersDir);
        }
  
        const characterPath = path.join(charactersDir, `${characterData.sections.General.name}.json`);
      
      await fs.writeFile(characterPath, JSON.stringify(characterData, null, 2));
      
      res.json({ success: true, message: 'Character saved successfully' });
    } catch (error) {
      console.error('Error saving character:', error);
      res.status(500).json({ success: false, message: 'Error saving character' });
    }
  });

// Save roll history
app.post('/api/roll-history', verifyToken, async (req, res) => {
    try {
        const { roll } = req.body;
        const userRollHistoryFile = path.join(USERS_DIR, req.username, 'roll_history.json');

        let rollHistory = { rolls: [] };
        try {
            const data = await fs.readFile(userRollHistoryFile, 'utf-8');
            rollHistory = JSON.parse(data);
        } catch (error) {
            // Файл не існує або не може бути прочитаний, використовуємо пустий масив
            console.log('Roll history file not found, creating new one');
        }

        rollHistory.rolls.push({
            ...roll,
            timestamp: new Date().toISOString()
        });

        await fs.writeFile(
            userRollHistoryFile,
            JSON.stringify(rollHistory, null, 2)
        );

        res.json({ message: 'Roll history saved' });
    } catch (error) {
        console.error('Error saving roll history:', error);
        res.status(500).json({ message: 'Error saving roll history' });
    }
});

// Get available game systems and their configs
app.get('/api/configs', async (req, res) => {
    try {
        const configsDir = path.join(__dirname, "configs");
        const systems = [];

        // Читаємо директорії систем
        const systemDirs = await fs.readdir(configsDir);
        
        for (const systemDir of systemDirs) {
            const systemPath = path.join(configsDir, systemDir);
            const stat = await fs.stat(systemPath);
            
            if (stat.isDirectory()) {
                // Читаємо конфігураційні файли системи
                const configFiles = await fs.readdir(systemPath);
                const configs = await Promise.all(
                    configFiles
                        .filter(file => file.endsWith('.json'))
                        .map(async file => {
                            const filePath = path.join(systemPath, file);
                            const content = await fs.readFile(filePath, 'utf-8');
                            const config = JSON.parse(content);
                            return {
                                filename: file,
                                name: config.name || file.replace('.json', ''),
                                version: config.version || 'standard'
                            };
                        })
                );
                
                systems.push({
                    system: systemDir,
                    configs: configs
                });
            }
        }
        
        res.json(systems);
    } catch (error) {
        console.error('Error getting system configs:', error);
        res.status(500).json({ message: 'Error loading system configurations' });
    }
});

// Get specific system configuration
app.get('/api/systems/:system/:version', async (req, res) => {
    try {
        const { system, version } = req.params;
        const configPath = path.join(__dirname, "configs", system, `${version}.json`);
        
        const configData = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(configData);
        
        res.json(config);
    } catch (error) {
        console.error('Error loading system configuration:', error);
        res.status(404).json({ message: 'System configuration not found' });
    }
});

// Get character by name
app.get('/api/characters/:name', verifyToken, async (req, res) => {
    try {
        if (!req.user?.username) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated properly'
            });
        }

        const username = req.user.username;
        console.log('Getting character for user:', username);
        
        const characterName = decodeURIComponent(req.params.name);
        console.log('Looking for character:', characterName);
        
        const characterPath = path.join(__dirname, 'users', username, 'characters', `${characterName}.json`);
        console.log('Full path:', characterPath);

        if (!fsSync.existsSync(characterPath)) {
            return res.status(404).json({ 
                success: false, 
                message: 'Character not found',
                details: {
                    characterName,
                    username,
                    searchPath: characterPath
                }
            });
        }

        const characterData = await fs.readFile(characterPath, 'utf8');
        console.log('Character loaded successfully');
        
        res.json({ 
            success: true, 
            character: JSON.parse(characterData) 
        });
    } catch (error) {
        console.error('Error reading character:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error reading character',
            details: error.message 
        });
    }
});



// Handle dice rolls
app.post('/rolls', verifyToken, async (req, res) => {
    try {
        const { formula, result } = req.body;
        
        if (!req.user?.username) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated properly'
            });
        }

        // Save roll to history if needed
        const username = req.user.username;
        const userRollHistoryPath = path.join(__dirname, 'users', username, 'roll_history.json');
        
        let rollHistory = [];
        if (fsSync.existsSync(userRollHistoryPath)) {
            const historyData = await fs.readFile(userRollHistoryPath, 'utf8');
            rollHistory = JSON.parse(historyData);
        }

        rollHistory.push({
            formula,
            result,
            timestamp: new Date().toISOString()
        });

        await fs.writeFile(userRollHistoryPath, JSON.stringify(rollHistory, null, 2));

        res.json({ 
            success: true, 
            message: 'Roll saved successfully' 
        });
    } catch (error) {
        console.error('Error handling roll:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error handling roll',
            details: error.message 
        });
    }
});

// Update user profile
app.put('/api/user/profile', verifyToken, async (req, res) => {
    try {
        const { username, email } = req.body;
        const currentUsername = req.user.username;

        // Validate input
        if (!username || !email) {
            return res.status(400).json({
                success: false,
                message: 'Username and email are required'
            });
        }

        // Check if new username is already taken (if username is being changed)
        if (username !== currentUsername) {
            const checkUsername = await new Promise((resolve, reject) => {
                connection.query(
                    'SELECT id FROM users WHERE username = ? AND username != ?',
                    [username, currentUsername],
                    (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    }
                );
            });
            
            if (checkUsername.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Username is already taken'
                });
            }
        }

        // Check if new email is already taken
        const checkEmail = await new Promise((resolve, reject) => {
            connection.query(
                'SELECT id FROM users WHERE email = ? AND username != ?',
                [email, currentUsername],
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                }
            );
        });
        
        if (checkEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        // Update user in database
        await new Promise((resolve, reject) => {
            connection.query(
                'UPDATE users SET username = ?, email = ? WHERE username = ?',
                [username, email, currentUsername],
                (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                }
            );
        });

        // If username changed, rename user directory
        if (username !== currentUsername) {
            const oldPath = path.join(__dirname, 'users', currentUsername);
            const newPath = path.join(__dirname, 'users', username);
            
            if (fsSync.existsSync(oldPath)) {
                await fs.rename(oldPath, newPath);
            }
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            username,
            email
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            details: error.message
        });
    }
});

// Update character
app.put('/api/characters/:name', verifyToken, async (req, res) => {
  try {
    if (!req.user?.username) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated properly'
      });
    }

    const characterName = req.params.name;
    const userCharactersDir = path.join(__dirname, 'users', req.user.username, 'characters');
    const characterPath = path.join(userCharactersDir, `${characterName}.json`);

    // Перевіряємо чи існує файл
    if (!fsSync.existsSync(characterPath)) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    // Читаємо поточний файл персонажа
    const currentCharacter = JSON.parse(await fs.readFile(characterPath, 'utf8'));
    
    // Оновлюємо тільки секції, зберігаючи інші дані
    const updatedCharacter = {
      ...currentCharacter,
      sections: req.body.sections
    };

    // Зберігаємо оновлений файл
    await fs.writeFile(characterPath, JSON.stringify(updatedCharacter, null, 2));

    res.json({
      success: true,
      message: 'Character updated successfully',
      character: updatedCharacter
    });

  } catch (error) {
    console.error('Error updating character:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update character',
      details: error.message
    });
  }
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
