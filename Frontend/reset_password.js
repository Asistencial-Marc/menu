import { API_BASE_URL } from './config.js';

document.getElementById('reset-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const newPassword = document.getElementById('new-password').value;

  // Validació de contrasenya
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;

  if (!passwordRegex.test(newPassword)) {
    Swal.fire({
      title: 'Contrasenya no vàlida',
      text: 'Ha de tenir almenys 8 caràcters, una majúscula, una minúscula i un caràcter especial.',
      icon: 'warning',
      background: '#FFF4F1',
      color: '#503030',
      iconColor: '#F39C12',
      showConfirmButton: true,
      customClass: {
        popup: 'swal-custom-error-popup',
        title: 'swal-custom-error-title',
        text: 'swal-custom-error-text',
      }
    });
    return;
  }

  if (!token) {
    Swal.fire({
      title: `Token expirat`,
      text: `La sessió ha caducat`,
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
      Swal.fire({
        title: `Contrasenya canviada correctament!`,
        text: `Torna a la pàgina i inicia sessió`,
        icon: 'success',
        background: '#f0fff0',
        color: '#2f4f4f',
        iconColor: '#4CAF50',
        timer: 2500,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: () => { Swal.showLoading(); },
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          text: 'swal-custom-text',
          timerProgressBar: 'swal-progress-bar'
        }
      }).then(() => {
        window.location.href = '/login';
      });
    } else {
      Swal.fire({
        title: `Hi ha aparegut un problema.`,
        text: `El problema: ${data.message}, torna a intentar-ho.`,
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
  } catch (error) {
    Swal.fire({
      title: `Error en la connexió amb el servidor.`,
      text: `Hi ha hagut un problema: ${error}`,
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
});
