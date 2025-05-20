import { API_BASE_URL } from './config.js';
// Función para cerrar sesión
function tancar_sesio() {
    console.log("Cerrar sesión");

    // Eliminar el token del localStorage para cerrar sesión
    localStorage.removeItem('token');
    
    // También eliminar la cookie si es necesario
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirigir a la página de login
    window.location.href = '/login';
}

// Función para comprobar si el usuario está autenticado y validar el token
async function comprovarToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verificacio`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.warn('Token invàlid');
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error al verificar token:', error);
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}


// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tancament-sesio').forEach(button => {
        button.addEventListener('click', tancar_sesio);
    });

    comprovarToken(); // Validar token al cargar la página
});
