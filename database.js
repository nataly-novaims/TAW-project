// simple json file as database 
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'users.json');

// create file if it doesn't exist yet
if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({ users: [], nextId: 1 }));
}

function read() {
    return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

function save(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function findUser(usernameOrEmail) {
    const db = read();
    return db.users.find(u => u.username === usernameOrEmail || u.email === usernameOrEmail);
}

function findById(id) {
    const db = read();
    return db.users.find(u => u.id === id);
}

function addUser(username, email, hashedPassword) {
    const db = read();
    const user = {
        id: db.nextId,
        username: username,
        email: email,
        password: hashedPassword
    };
    db.users.push(user);
    db.nextId++;
    save(db);
    return user;
}

module.exports = { findUser, findById, addUser };
