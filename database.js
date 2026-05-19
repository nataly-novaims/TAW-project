// ============================================================
// database.js
// ------------------------------------------------------------
// A tiny file based "database". Instead of using a heavy database
// engine, we save our users to a single JSON file (users.json).
// This keeps the project simple, zero config, and easy to inspect:
// you can literally open users.json in any text editor.
//
// In production you would replace this with a real database
// like PostgreSQL or MongoDB, but the IDEAS are the same:
//   - Persist data to disk
//   - Provide functions to read and write that data
//   - Enforce uniqueness (no duplicate usernames / emails)
// ============================================================

const fs = require('fs');
const path = require('path');

// Path to the JSON file that stores all our users.
const DB_FILE = path.join(__dirname, 'users.json');

// If the file does not exist yet, create it with an empty users array.
// This way the app works the first time you run it, without any setup.
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], nextId: 1 }, null, 2));
}

// --- Internal helpers ---------------------------------------

// Read the whole database from disk and return it as a JS object.
function readDB() {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
}

// Save the whole database back to disk (pretty-printed JSON).
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}


// --- Public API used by routes/auth.js ----------------------

// Find a user by their username OR email (case-sensitive match).
// Returns the user object, or undefined if not found.
function findUserByUsernameOrEmail(usernameOrEmail) {
    const db = readDB();
    return db.users.find(
        u => u.username === usernameOrEmail || u.email === usernameOrEmail
    );
}

// Find a user by their numeric id. Returns undefined if not found.
function findUserById(id) {
    const db = readDB();
    return db.users.find(u => u.id === id);
}

// Create a new user. Returns the newly created user object.
// The caller is responsible for passing an ALREADY HASHED password.
function createUser({ username, email, hashedPassword }) {
    const db = readDB();

    // Assign a fresh auto-incrementing id (like a database PRIMARY KEY).
    const newUser = {
        id: db.nextId,
        username,
        email,
        password: hashedPassword,            // bcrypt hash, never plain text
        created_at: new Date().toISOString()
    };

    db.users.push(newUser);
    db.nextId += 1;
    writeDB(db);

    return newUser;
}


module.exports = {
    findUserByUsernameOrEmail,
    findUserById,
    createUser
};
