// Import necessary libraries
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); // SQLite3 for database interaction
const path = require('path');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const cors = require('cors'); // For handling CORS

// Initialize the Express app
const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Allow requests from your frontend's origin
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5501'], // Allow frontend origins
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
}));

// Set up the SQLite database
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

// Create the reservations table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    confirmation_number TEXT NOT NULL UNIQUE,
    dog_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    breed TEXT NOT NULL,
    age INTEGER NOT NULL,
    special_requirements TEXT,
    date TEXT NOT NULL,
    status TEXT NOT NULL
  )
`);

// POST route for user registration
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required.' });
  }

  // Check if the username already exists
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (row) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    try {
      // Hash the password before saving it to the database
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the new user into the database with the hashed password
      const stmt = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
      stmt.run([username, hashedPassword, role], function(err) {
        if (err) {
          console.error('Error inserting into database:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
      });
      stmt.finalize();
    } catch (error) {
      console.error('Error hashing password:', error);
      return res.status(500).json({ message: 'Error hashing password' });
    }
  });
});

// POST route for user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check if the user exists in the database
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!row) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    try {
      // Compare the password with the stored hashed password
      const isMatch = await bcrypt.compare(password, row.password);

      if (isMatch) {
        res.status(200).json({ message: `Welcome, ${username}!`, role: row.role });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
});

// POST route for adding a reservation
app.post('/reservations', (req, res) => {
  const { dogName, ownerName, breed, age, specialReq, date } = req.body;
  const confirmationNumber = `CN${Math.floor(100000 + Math.random() * 900000)}`; // Generate unique confirmation number

  if (!dogName || !ownerName || !breed || !age || !date) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Insert reservation data into the reservations table
  const stmt = db.prepare(`
    INSERT INTO reservations (confirmation_number, dog_name, owner_name, breed, age, special_requirements, date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run([confirmationNumber, dogName, ownerName, breed, age, specialReq, date, 'Pending'], function(err) {
    if (err) {
      console.error('Error inserting reservation:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({
      message: 'Reservation added successfully',
      confirmationNumber: confirmationNumber,
    });
  });
  stmt.finalize();
});

// GET route for fetching all reservations
app.get('/reservations', (req, res) => {
  db.all('SELECT * FROM reservations', [], (err, rows) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json(rows);
  });
});

// GET route for fetching a specific reservation by confirmation number
app.get('/reservations/:confirmationNumber', (req, res) => {
  const { confirmationNumber } = req.params;

  db.get('SELECT * FROM reservations WHERE confirmation_number = ?', [confirmationNumber], (err, row) => {
    if (err) {
      console.error('Error fetching reservation:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(row);
  });
});

// PUT route to update a reservation (Edit functionality)
app.put('/reservations/:id', (req, res) => {
  const { id } = req.params;
  const { dogName, ownerName, breed, age, specialReq, date } = req.body;

  if (!dogName || !ownerName || !breed || !age || !date) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const stmt = db.prepare(`
    UPDATE reservations
    SET dog_name = ?, owner_name = ?, breed = ?, age = ?, special_requirements = ?, date = ?
    WHERE id = ?
  `);
  stmt.run([dogName, ownerName, breed, age, specialReq, date, id], function(err) {
    if (err) {
      console.error('Error updating reservation:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'Reservation updated successfully' });
  });
  stmt.finalize();
});

// DELETE route to remove a reservation
app.delete('/reservations/:id', (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare('DELETE FROM reservations WHERE id = ?');
  stmt.run([id], function(err) {
    if (err) {
      console.error('Error deleting reservation:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'Reservation deleted successfully' });
  });
  stmt.finalize();
});

// PUT route to mark a reservation as "checked out"
app.put('/reservations/checkout/:id', (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare(`
    UPDATE reservations
    SET status = 'Checked Out'
    WHERE id = ?
  `);
  stmt.run([id], function(err) {
    if (err) {
      console.error('Error updating reservation status:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'Reservation marked as checked out' });
  });
  stmt.finalize();
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
