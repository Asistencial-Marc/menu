document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
  
    const data = await response.json();
  
    if (response.ok) {
        // Almacenar token y rol
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
  
        console.log("ROL RECIBIDO:", data.role);
  
        // Mostrar SweetAlert2 con bienvenida
        Swal.fire({
          title: `Benvingut, ${data.name || username}!`,
          text: 'Has iniciat sessió correctament.',
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
            // Redirigir según rol
            if (data.role === 'cocinero') {
                window.location.href = '/principal_cuiner';
            } else if (data.role === 'empleado') {
                window.location.href = '/principal_usuaris';
            } else if (data.role === 'administrador') {
                window.location.href = '/principal_admin';
            }
        });
  
    } else {
        // Error con SweetAlert2
        Swal.fire({
          title: `No s'ha pogut iniciar sesió`,
          text: data.message || "No s'ha pogut iniciar la sesió ",
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
  