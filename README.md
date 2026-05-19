# Events for Students — TAW Project

A simple web application where students can browse and register for events in Lisbon. Built as a university group project for the TAW course.

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js + Express
- **Storage:** JSON file (`users.json`) — simple and inspectable
- **Password hashing:** bcryptjs
- **Sessions:** JSON Web Tokens (JWT)

## Project Structure

```
events-project/
├── public/                  # Frontend (served as static files)
│   ├── index.html           # Home page
│   ├── events.html          # All events page (with filters)
│   ├── event-details.html   # Single event page
│   ├── registration.html    # Signup form
│   ├── login.html           # Login form
│   ├── style.css            # All styles
│   ├── app.js               # Events rendering logic
│   ├── auth.js              # Frontend auth logic (signup/login/navbar)
│   ├── data.js              # Hardcoded events data
│   └── background.jpg
├── routes/
│   └── auth.js              # API routes: /signup, /login, /me
├── server.js                # Express server entry point
├── database.js              # Tiny JSON-file storage layer
├── package.json             # Dependencies & scripts
├── .env                     # Environment variables (NOT committed)
├── .gitignore
├── users.json               # Auto-created on first run (NOT committed)
└── README.md
```

## Setup & Run

You need [Node.js](https://nodejs.org/) installed (version 18 or newer).

```bash
# 1. Install all dependencies listed in package.json
npm install

# 2. Start the server
npm start
```

Then open your browser at:

```
http://localhost:3000
```

For development with auto-reload on file changes:

```bash
npm run dev
```

## API Endpoints

| Method | URL                  | Body                              | What it does                          |
|--------|----------------------|-----------------------------------|---------------------------------------|
| POST   | `/api/auth/signup`   | `{ username, email, password }`   | Creates a new user                    |
| POST   | `/api/auth/login`    | `{ username, password }`          | Logs in (username can be the email)   |
| GET    | `/api/auth/me`       | Header: `Authorization: Bearer <jwt>` | Returns the logged-in user        |

All responses are JSON.

## How to Test

1. Start the server: `npm start`
2. Open `http://localhost:3000` in your browser.
3. Click **Register**, fill the form (username ≥ 3 chars, valid email, password ≥ 6 chars), submit.
4. You should be redirected to the home page. The navbar should now show "Hello, your-username" and a Logout link.
5. Click Logout, then click Login, and log in with the same credentials.
6. Try error cases: short password, invalid email, duplicate username, wrong password.
7. Open `users.json` in any text editor — you'll see your user with a hashed password (`$2a$10$...`), never plain text.

## Security Notes

- Passwords are hashed with **bcrypt** (cost factor 10) before being stored.
- Sessions use **JWT** tokens signed with `JWT_SECRET` from `.env`.
- The `.env` file is in `.gitignore` so secrets never leave your machine.
- `users.json` is also in `.gitignore` so user data never leaves your machine.
- Login errors use a generic "Invalid username or password" message so attackers can't tell whether a username exists.

## Why a JSON File Instead of a Real Database?

For a small university project demo, a JSON file:
- Requires zero setup (no database server to install or configure)
- Is easy to inspect — open in any text editor
- Implements the same concepts as a real database (schema, persistence, CRUD, uniqueness checks)

To upgrade to a real database later (e.g. PostgreSQL or MongoDB), you only need to rewrite `database.js` — the three exported functions stay the same, so nothing else in the project changes.
