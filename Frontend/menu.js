import { API_BASE_URL } from './config.js';
// Registrar menú (solo en menu.html)
document.getElementById('menu-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const day = document.getElementById('day').value;
    const firstOption = document.getElementById('firstOption').value;
    const firstOption2 = document.getElementById('firstOption2').value;
    const secondOption = document.getElementById('secondOption').value;
    const secondOption2 = document.getElementById('secondOption2').value;
    const dessertOption = document.getElementById('dessertOption').value;
    const dessertOption2 = document.getElementById('dessertOption2').value;

    const token = localStorage.getItem('token');  // Obtener el token desde localStorage
    const role = localStorage.getItem('role');

    if (!token || role !== 'cocinero') {
        // Si no hi ha token o el rol no és cuiner, redirigir al login o a la pàgina corresponent
        window.location.href = 'login.html';
      }

    const response = await fetch(`${API_BASE_URL}/api/menu`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Asegúrate de enviar el token correctamente
        },
        body: JSON.stringify({ day, firstOption, firstOption2, secondOption, secondOption2, dessertOption, dessertOption2 })
    });

    const data = await response.json();

    if (response.ok) {
      // Mostrar mensaje de éxito
      Swal.fire({
        title: `Menú registrat amb èxit!`,
        text: `Tornant a la pagina principal`,
        icon: 'success',
        background: '#f0fff0',
        color: '#2f4f4f',
        iconColor: '#4CAF50',
        timer: 1000,
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
        window.location.href = '/menu';
      });
    
    } else if (response.status === 409) {
      // Ya existe un menú ese día
      Swal.fire({
        title: 'Atenció',
        text: data.message || 'Ja existeix un menú registrat per aquest dia.',
        icon: 'warning',
        background: '#fffbea',
        color: '#5a4500',
        iconColor: '#f5a623',
        showConfirmButton: true,
        customClass: {
          popup: 'swal-custom-error-popup',
          title: 'swal-custom-error-title',
          text: 'swal-custom-error-text',
        }
      });
    
    } else {
      // Otro error
      Swal.fire({
        title: `Error al registrar menú.`,
        text: `El problema: ${data.message}, torna ha intentar un altre cop`,
        icon: 'error',
        background: '#FFF4F1',
        color: '#503030',
        iconColor: '#B14C4C',
        showConfirmButton: true,
        customClass: {
          popup: 'swal-custom-error-popup',
          title: 'swal-custom-error-title',
          text: 'swal-custom-error-text',
        }
      });
    }
  })