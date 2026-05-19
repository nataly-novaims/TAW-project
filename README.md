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


