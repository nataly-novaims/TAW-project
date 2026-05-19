// 
// server.js
// 
// This is the entry point of the backend.
// Running `npm start` runs this file, which:
//   1. Loads environment variables from .env
//   2. Starts an Express web server
//   3. Serves all the frontend files in /public
//   4. Exposes the authentication API under /api/auth/*
// 

// Load environment variables (PORT, JWT_SECRET) from the .env file.
require('dotenv').config();

const express = require('express');
const path = require('path');
const authRoutes = require('./routes/auth');

// Make sure the database is initialised (this creates the table if needed).
require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

//  Middleware 

// Allow Express to parse JSON request bodies (e.g. { "username": "..." }).
app.use(express.json());

// Serve every file in the /public folder as a static asset.
// This means index.html, style.css, app.js, background.jpg etc. are
// all available at the root of the website.
app.use(express.static(path.join(__dirname, 'public')));

//  Routes 

// Mount the authentication routes under /api/auth.
// So POST /api/auth/signup, POST /api/auth/login, GET /api/auth/me.
app.use('/api/auth', authRoutes);

//  Start the server 

app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
    console.log(`   Open that URL in your browser to use the app.`);
});
