// handles signup, login and the navbar

function saveUser(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function getUser() {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// change the navbar if user is logged in
function updateNavbar() {
    const nav = document.querySelector('.auth-buttons');
    if (!nav) return;

    const user = getUser();
    if (user) {
        nav.innerHTML = '<span style="color:white; opacity:0.7;">Hi, ' + user.username + '</span>'
                      + '<a href="#" id="logout-link">Logout</a>';
        document.getElementById('logout-link').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    } else {
        nav.innerHTML = '<a href="registration.html">Register</a><a href="login.html">Login</a>';
    }
}

function showMessage(text, isError) {
    const el = document.getElementById('form-message');
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? '#ff6b6b' : '#7CFC9F';
}

// signup form
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();

            if (!res.ok) {
                showMessage(data.error, true);
                return;
            }

            saveUser(data.token, data.user);
            showMessage('Account created!', false);
            setTimeout(function() { window.location.href = 'index.html'; }, 700);
        } catch (err) {
            showMessage('Cannot connect to server', true);
        }
    });
}

// login form
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (!res.ok) {
                showMessage(data.error, true);
                return;
            }

            saveUser(data.token, data.user);
            showMessage('Logged in!', false);
            setTimeout(function() { window.location.href = 'index.html'; }, 700);
        } catch (err) {
            showMessage('Cannot connect to server', true);
        }
    });
}

document.addEventListener('DOMContentLoaded', updateNavbar);
