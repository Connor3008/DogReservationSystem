
// Import necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); // SQLite3 for database interaction
const path = require('path');

// Initialize the Express app
const app = express();
const cors = require('cors');

// Allow requests from your frontend's origin
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // If you need cookies or credentials
  }));

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Set up the database
const db = new sqlite3.Database('./database/dog_kennel.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Handle preflight requests
app.options('*', cors());

// Create the users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
  )
`);

// POST route for user registration
app.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' });
  }

  // Check if the username already exists
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (row) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Insert the new user into the database
    const stmt = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
    stmt.run([username, password, role], function(err) {
      if (err) {
        console.error('Error inserting into database:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
    });
    stmt.finalize();
  });
});

// POST route for user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check if the user exists in the database
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!row) {
      // Check for the admin user
      if (username === 'admin' && password === 'adminpassword') {
        return res.status(200).json({ message: `Welcome, Admin!`, role: 'admin' });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    res.status(200).json({ message: `Welcome, ${username}!`, role: row.role });
  });
});


// Root route
app.get('/', (req, res) => {
  res.send('Hello Dog Kennel!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get('/reservations', (req, res) => {
  db.all('SELECT * FROM reservations', [], (err, rows) => {
    if (err) {
      console.error('Error fetching reservations:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json({ reservations: rows });
  });
});

