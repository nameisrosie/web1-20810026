const API = "https://web1-api.vercel.app/api";
const AUTHENTICATION_API = 'https://web1-api.vercel.app/users';
const siteKey = "6Lea2bcpAAAAAArBqKF1mP8v0lCpOhivhL9JnPZz";

async function loadData(request, templateId, viewId) {
    try {
        const response = await fetch(`${API}/${request}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        var template = Handlebars.templates[`${templateId}`];
        var context = { data: data };

        var view = document.getElementById(viewId);
        if (view) {
            view.innerHTML = template(context);
        } else {
            console.error(`Element with ID '${viewId}' not found.`);
        }
    } catch (error) {
        console.error("Error loading data:", error);
        const view = document.getElementById(viewId);
        if (view) {
            view.innerHTML = "<p class='text-danger'>Sorry, an error occurred while loading the content.</p>";
        }
    }
}

async function login(e) {
    e.preventDefault();

    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');
    let errorMessageDiv = document.getElementById('errorMessage');

    if (!usernameInput || !passwordInput || !errorMessageDiv) {
        console.error("Login form elements not found.");
        if (errorMessageDiv) {
            errorMessageDiv.innerHTML = "Login form is not set up correctly. Please contact support.";
        }
        return;
    }

    let username = usernameInput.value;
    let password = passwordInput.value;
    errorMessageDiv.innerHTML = '';

    try {
        let token = await getAuthenticateToken(username, password);
        if (token) {
            localStorage.setItem('token', token);

            const modalLoginElement = document.getElementById('modalLogin');
            if (modalLoginElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalLoginElement);
                if (modalInstance) {
                    modalInstance.hide();
                } else {
                    const closeButton = modalLoginElement.querySelector('.btn-close');
                    if (closeButton) closeButton.click();
                }
            }
            displayControls(true);
        }
    } catch (error) {
        errorMessageDiv.innerHTML = error.message;
        displayControls(false);
    }
}

async function getAuthenticateToken(username, password) {
    const response = await fetch(`${AUTHENTICATION_API}/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
        return result.token;
    }
    throw new Error(result.message || `Authentication failed with status: ${response.status}`);
}

function displayControls(isLogin = true) {
    let linkLogins = document.getElementsByClassName('linkLogin');
    let linkLogouts = document.getElementsByClassName('linkLogout');

    let displayLoginStyle = isLogin ? 'none' : 'block';
    let displayLogoutStyle = isLogin ? 'block' : 'none';

    for (let link of linkLogins) {
        link.style.display = displayLoginStyle;
    }

    for (let link of linkLogouts) {
        link.style.display = displayLogoutStyle;
    }

    let commentControl = document.getElementById('leave-comments');
    if (commentControl) {
        commentControl.style.display = displayLogoutStyle;
    }
}

async function checkLogin() {
    try {
        let isLogin = await verifyToken();
        displayControls(isLogin);
    } catch (error) {
        console.error("Error during checkLogin:", error);
        displayControls(false);
    }
}

async function verifyToken() {
    let token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${AUTHENTICATION_API}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            return response.ok;
        } catch (error) {
            console.error("Error verifying token:", error);
            return false;
        }
    }
    return false;
}

function logout() {
    localStorage.removeItem('token');
    displayControls(false);
}

document.addEventListener('DOMContentLoaded', () => {
    checkLogin();

    const loginForm = document.getElementById('formLogin');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }

    const logoutLinks = document.getElementsByClassName('linkLogout');
    for (let logoutLink of logoutLinks) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    }
});