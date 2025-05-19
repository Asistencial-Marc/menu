document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Evitar que el formulario se envíe de forma predeterminada

    const codi = document.getElementById('codi').value;
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const role = document.getElementById('role').value;

    // Verificar si las contraseñas coinciden
    if (password !== password2) {
        console.log('Les contrasenyes no coincideixen. Si us plau, torna a provar.');
        Swal.fire({
            title: `Les contrasenyes no coincideixen.`,
            text: "Si us plau, torna a provar i assegurat que la contrasenya coincideixi",
            icon: 'error',
            background: '#FFF4F1',
            color: '#503030',
            iconColor: '#B14C4C',
            showConfirmButton: true,
            customClass: {
              popup: 'swal-custom-error-popup',
              title: 'swal-custom-error-title',
              text: 'swal-custom-error-text',
            }});
        return;  // Detener el envío del formulario si las contraseñas no coinciden
    }

    // Log de los datos que se van a enviar
    console.log("Datos del formulario:", { codi, name, email, password, role });

    const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codi, name, username, email, password, role })
    });
    
    const data = await response.json();

    // Verifica la respuesta del servidor
    console.log('Respuesta del servidor:', data);

    if (response.ok) {
        Swal.fire({
            title: `Usuari Registrat!`,
            text: `Has registrat correctament a ${username} amb el nom de ${name}`,
            icon: 'success',
            background: '#f0fff0',
            color: '#2f4f4f',
            iconColor: '#4CAF50',
            timer: 2500,
            showConfirmButton: false,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            },
            customClass: {
              popup: 'swal-custom-popup',
              title: 'swal-custom-title',
              text: 'swal-custom-text',
              timerProgressBar: 'swal-progress-bar'
            }
          }).then(() => {
        window.location.href = '/principal_admin';  // Redirige al login después de registrarse
          });
    } else {
        console.log('Error al registrar: ' + data.message);
        Swal.fire({
            title: `Error al registrar.`,
            text: `Hi ha hagun un problema ${data.messages}`,
            icon: 'error',
            background: '#FFF4F1',
            color: '#503030',
            iconColor: '#B14C4C',
            showConfirmButton: true,
            customClass: {
              popup: 'swal-custom-error-popup',
              title: 'swal-custom-error-title',
              text: 'swal-custom-error-text',
            }});
    }
});
