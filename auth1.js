const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'my-secret-key';

// signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please fill all fields' });
        }
        if (username.length < 3) {
            return res.status(400).json({ error: 'Username too short' });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password too short (min 6 characters)' });
        }

        // check if user already exists
        if (db.findUser(username) || db.findUser(email)) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // hash the password so we don't save it as plain text
        const hashed = await bcrypt.hash(password, 10);
        const user = db.addUser(username, email, hashed);

        // make a token for the user
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token: token,
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Please fill all fields' });
        }

        const user = db.findUser(username);
        if (!user) {
            return res.status(401).json({ error: 'Wrong username or password' });
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ error: 'Wrong username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' });

        res.json({
            token: token,
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// check who is logged in
router.get('/me', (req, res) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ error: 'No token' });
    }

    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET);
        const user = db.findById(decoded.id);
        if (!user) return res.status(401).json({ error: 'User not found' });
        res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;

