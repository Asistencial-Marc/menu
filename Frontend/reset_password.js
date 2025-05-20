import { API_BASE_URL } from './config.js';

document.getElementById('reset-form').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const newPassword = document.getElementById('new-password').value;
  
    if (!token) {
      alert('Token no vàlid.');
      Swal.fire({
        title: `Token expirat`,
        text: `La sesió ah caducat`,
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
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Contrasenya canviada correctament!');
        Swal.fire({
          title: `Contrasenya canviada correctament!`,
          text: `Torna a la pagina i fés sesió`,
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
      window.location.href = '/login';  // Redirige al login después de registrarse
        });
      } else {
        crossOriginIsolated.log('Error: ' + data.message);
        Swal.fire({
          title: `Hi ha aparegut un problema.`,
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
          }});
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: `Error en la connexió amb el servidor.`,
        text: `Hi ha hagun un problema ${error}`,
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
  