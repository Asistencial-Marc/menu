// Iniciar sessió (solo en login.html)
import { API_BASE_URL } from './config.js';

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        // Guardar el token JWT en localStorage
        localStorage.setItem('token', data.token);
        window.location.href = 'menu.html';  // Redirigir al menú
    } else {
        alert('Error a iniciar sessió: ' + data.message);
    }
});

// Registrar menú (solo en menu.html)
document.getElementById('menu-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const day = document.getElementById('day').value;
    const firstOption = document.getElementById('firstOption').value;
    const secondOption = document.getElementById('secondOption').value;
    const dessertOption = document.getElementById('dessertOption').value;

    const token = localStorage.getItem('token');

    if (!token) {
        // Si no hay token, redirigir al login
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch(`${API_BASE_URL}/api/menu`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Enviar el token en los headers
        },
        body: JSON.stringify({ day, firstOption, secondOption, dessertOption })
    });

    const data = await response.json();

    if (response.ok) {
        alert('Menú registrat amb èxit');
    } else {
        alert('Error al registrar menú: ' + data.message);
    }
});

// Obtenir el menú i permetre seleccionar (solo en menu.html)
document.getElementById('menu-selection-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const selectedMenu = document.getElementById('select-menu').value;
    const token = localStorage.getItem('token');

    if (!token) {
        // Si no hay token, redirigir al login
        window.location.href = 'login.html';
        return;
    }

    const response = await fetch(`${API_BASE_URL}/api/menu/${selectedMenu}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`  // Enviar el token en los headers
        }
    });

    const data = await response.json();

    if (response.ok) {
        alert('Menú seleccionat amb èxit');
    } else {
        alert('Error al seleccionar el menú: ' + data.message);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Agregar el evento a todos los botones con la clase 'tancament-sesio'
    document.querySelectorAll('.tancament-sesio').forEach(button => {
        if (button) {
            button.addEventListener('click', function(event) {
                tancar_sesió();
            });
        }
    });
    
    // Función para cerrar sesión
    function tancar_sesió() {
        console.log("Cerrar sesión");

        // Eliminar el token del localStorage para cerrar sesión
        localStorage.removeItem('token');
        
        // También eliminar la cookie si es necesario
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Redirigir a la página de login
        window.location.href = 'login.html';  // Redirige a la página de login
    }
    
    // Protege las páginas, redirige si no hay token
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';  // Redirige al login si no hay token
    }
});
// Protege las páginas, redirige si no hay token
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    // Si no hay token, redirigir al login
    if (!token) {
        window.location.href = 'login.html';
    }
});