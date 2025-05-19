document.getElementById('enviar-informe').addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const confirmar = confirm('Estàs segur que vols enviar l’informe mensual ara?');
  
    if (!confirmar || !token) return;
  
    try {
      const res = await fetch('http://localhost:5000/api/admin/enviar-informe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await res.json();
      console.log(data.message || 'Informe enviat correctament!');
      Swal.fire({
        title: `Informe enviat correctament!`,
        text: `Ja pots avisar ${data.message}`,
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
    } catch (error) {
      console.error('Error en l’enviament:', error);
      Swal.fire({
        title: `Error en l’enviament:.`,
        text: `El problema: ${error}, torna ha intentar un altre cop`,
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
  