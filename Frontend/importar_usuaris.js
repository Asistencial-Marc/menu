document.getElementById('importar-usuarios').addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  const fileInput = document.getElementById('file-csv');
  const file = fileInput.files[0];

  if (!file) {
    console.log("Selecciona un fitxer CSV abans de importar.");
    Swal.fire({
      title: `No hi ha fitxer.`,
      text: `Selecciona un fitxer CSV abans de importar.`,
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

  const confirmat = confirm("Estàs segur que vols importar els usuaris?");
  if (!confirmat) return;

  const formData = new FormData();
  formData.append('csv', file);

  try {
    const res = await fetch('http://localhost:5000/api/admin/importar-usuaris', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // NO pongas 'Content-Type': multipart/form-data, fetch lo pone automáticamente
      },
      body: formData
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
        Swal.fire({
          title: `Correcte!`,
          text: `${data.message}`,
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
      console.log('Error durant la importació: ' + (data.error || data.message));
      Swal.fire({
        title: `Error durant la importació.`,
        text: `Hi ha hagun un problema ${data.error || data.message}`,
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
  } catch (err) {
    console.error('Error:', err);
    Swal.fire({
      title: `Error en la connexió amb el servidor.`,
      text: `Hi ha hagun un problema ${err}`,
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
