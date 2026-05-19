// 
// public/auth.js
// 
// Frontend logic for authentication. It runs in the browser
// and is included on every page. It is responsible for:
//   1. Submitting the signup form (registration.html)
//   2. Submitting the login form (login.html)
//   3. Storing the JWT token after a successful login
//   4. Updating the navbar to show Login/Register OR the
//      logged in user's name and a Logout button
// 

// Helpers to read/write the auth state from localStorage 

// Save the JWT token + user object so the user stays logged in
// even after they close and reopen the tab.
function saveAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Return the saved user object, or null if not logged in.
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Clear the saved data and go back to the home page.
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}


// --- UI: update the navbar based on the auth state ----------

function updateNavbar() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return; // page has no navbar (e.g. an error page)

    const user = getCurrentUser();
    if (user) {
        // Logged in -> show "Hello, name" and a Logout link.
        authButtons.innerHTML = `
            <span style="color: white; opacity: 0.7;">Hello, ${user.username}</span>
            <a href="#" id="logout-link">Logout</a>
        `;
        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        // Logged out -> show Register and Login links.
        authButtons.innerHTML = `
            <a href="registration.html">Register</a>
            <a href="login.html">Login</a>
        `;
    }
}


//  UI: display a message inside the form 

function showMessage(text, isError = true) {
    const el = document.getElementById('form-message');
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? '#ff6b6b' : '#7CFC9F';
}


//  Form handlers 

// Attach a submit handler to the signup form (only present on registration.html).
function handleSignupForm() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // stop the browser from doing a full page reload

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            // Send the data to our backend.
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                // Server returned an error like 400 or 409.
                showMessage(data.error || 'Signup failed');
                return;
            }

            // Success! Save the token and go to the home page.
            saveAuth(data.token, data.user);
            showMessage('Account created! Redirecting...', false);
            setTimeout(() => { window.location.href = 'index.html'; }, 800);

        } catch (err) {
            // This usually means the backend isn't running.
            showMessage('Network error. Is the server running?');
        }
    });
}

// Attach a submit handler to the login form (only present on login.html).
function handleLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(data.error || 'Login failed');
                return;
            }

            saveAuth(data.token, data.user);
            showMessage('Logged in! Redirecting...', false);
            setTimeout(() => { window.location.href = 'index.html'; }, 600);

        } catch (err) {
            showMessage('Network error. Is the server running?');
        }
    });
}


//  Run everything once the page is ready 

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    handleSignupForm();
    handleLoginForm();
});
