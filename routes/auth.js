// ============================================================
// routes/auth.js
// ------------------------------------------------------------
// This file contains the three authentication API endpoints:
//   POST /api/auth/signup  -> create a new account
//   POST /api/auth/login   -> log in to an existing account
//   GET  /api/auth/me      -> get the currently logged-in user
//
// Libraries used:
//   * bcryptjs       -> hash passwords before saving them
//   * jsonwebtoken   -> create JWT session tokens
// ============================================================

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();

// Read the JWT secret from .env. If missing, fall back to a dev default
// so the app still runs (useful when first cloning the repo).
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = '7d'; // each login lasts 7 days


// --- Small validator ----------------------------------------

// Returns true if the string looks like a valid email address.
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// ============================================================
// POST /api/auth/signup
// Body: { username, email, password }
// ============================================================
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1) Make sure all three fields were sent.
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // 2) Basic validation rules.
        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Please enter a valid email address' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // 3) Check whether a user with the same username OR email already exists.
        if (db.findUserByUsernameOrEmail(username) || db.findUserByUsernameOrEmail(email)) {
            // 409 = Conflict: the resource already exists.
            return res.status(409).json({ error: 'Username or email is already in use' });
        }

        // 4) Hash the password. We NEVER store plain-text passwords!
        //    The "10" is the cost factor — higher = slower = more secure.
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5) Insert the new user into the database.
        const newUser = db.createUser({ username, email, hashedPassword });

        // 6) Create a JWT token so the user is logged in straight after signing up.
        const token = jwt.sign(
            { id: newUser.id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // 7) Send the token + safe user info back to the frontend.
        //    We never send the password (even hashed) back to the client.
        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Something went wrong on the server' });
    }
});


// ============================================================
// POST /api/auth/login
// Body: { username, password }   (username can also be the email)
// ============================================================
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1) Both fields are required.
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // 2) Look the user up.
        const user = db.findUserByUsernameOrEmail(username);

        // SECURITY NOTE: we use the SAME error message for "user not found" and
        // "wrong password" so an attacker can't probe which usernames exist.
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // 3) Compare the submitted password against the stored hash.
        //    bcrypt.compare hashes the submitted password the same way the
        //    stored one was hashed, then compares them safely.
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // 4) Credentials are good -> create a new JWT for this session.
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // 5) Send the token + user info to the frontend.
        res.json({
            message: 'Logged in successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Something went wrong on the server' });
    }
});


// ============================================================
// GET /api/auth/me
// Returns the user described by the JWT in the Authorization header.
// Useful for checking "am I still logged in?" from the frontend.
// ============================================================
router.get('/me', (req, res) => {
    // The frontend sends:  Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // jwt.verify throws if the token is invalid or expired.
        const decoded = jwt.verify(token, JWT_SECRET);

        // Double-check the user still exists (they might have been deleted).
        const user = db.findUserById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Return safe fields only.
        res.json({
            user: { id: user.id, username: user.username, email: user.email }
        });

    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
});


module.exports = router;
