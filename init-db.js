const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = './database';

// Ensure the database folder exists
if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    console.log("Database folder created.");
}

const db = new sqlite3.Database('./database/dog_kennel.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Database connected or created.');
    }
});

// SQL query to create users table
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);
`;

// SQL query to create reservations table
const createReservationsTable = `
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  confirmation_number TEXT UNIQUE NOT NULL,
  dog_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INTEGER NOT NULL,
  special_requirements TEXT,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'Pending'
);
`;

// Run the SQL statements to create the tables
db.serialize(() => {
    db.run(createUsersTable, (err) => {
        if (err) {
            console.error("Error creating users table:", err);
        } else {
            console.log("Users table created or already exists.");
        }
    });

    db.run(createReservationsTable, (err) => {
        if (err) {
            console.error("Error creating reservations table:", err);
        } else {
            console.log("Reservations table created or already exists.");
        }
    });
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error("Error closing database:", err);
    } else {
        console.log("Database connection closed.");
    }
});
