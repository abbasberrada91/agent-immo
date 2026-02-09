// auth.js - Système d'authentification simple
// À utiliser dans les pages protégées

function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated !== 'true') {
        // Rediriger vers la page de connexion
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    window.location.href = 'index.html';
}

function getUsername() {
    return localStorage.getItem('username') || 'Utilisateur';
}

function isLoggedIn() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

// Afficher les informations de l'utilisateur connecté
function displayUserInfo() {
    if (isLoggedIn()) {
        const username = getUsername();
        const userInfoDiv = document.createElement('div');
        userInfoDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 12px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 1000;
        `;
        
        userInfoDiv.innerHTML = `
            <span style="color: #2d3748; font-weight: 600;">👤 ${username}</span>
            <button onclick="logout()" style="
                background: #ef4444;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: background 0.2s;
            " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
                Déconnexion
            </button>
        `;
        
        document.body.appendChild(userInfoDiv);
    }
}
