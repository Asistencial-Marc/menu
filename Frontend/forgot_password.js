document.getElementById('forgot-form').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('S\'ha enviat un correu electrònic amb instruccions.');
          Swal.fire({
            title: `S\'ha enviat un correu electrònic amb instruccions`,
            text: `Espera a que arribi un correu`,
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
          });
      } else {
        console.log('Error: ' + data.message);
        Swal.fire({
          title: `Error.`,
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
      console.log('Error en la connexió amb el servidor.', error);
      Swal.fire({
        title: `Error en la connexió amb el servidor..`,
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
  