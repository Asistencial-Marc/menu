import { API_BASE_URL } from './config.js';
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return;
  }

  const selectDay = document.getElementById('select-day');
  const selectedUsersDiv = document.getElementById('selected-users');

  selectDay.addEventListener('change', async function() {
    const selectedDay = selectDay.value;

    if (!selectedDay) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/menu_seleccionat/selections/${selectedDay}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (response.ok) {
        selectedUsersDiv.innerHTML = "";

        if (data.users.length === 0) {
          selectedUsersDiv.innerHTML += "<p>No hi ha seleccions per aquest dia.</p>";
        } else {
          data.users.forEach(user => {
            const userHTML = `
              <div class="user-card">
                <p><strong>${user.name}</strong></p>
                <p>Primer plat: ${user.firstOption}</p>
                <p>Segon plat: ${user.secondOption}</p>
                <p>Postres: ${user.dessertOption}</p>
              </div>
            `;
            selectedUsersDiv.innerHTML += userHTML;
          });
        }
      } else {
        selectedUsersDiv.innerHTML = "<p>Error al carregar les seleccions.</p>";
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      selectedUsersDiv.innerHTML = "<p>Error de connexió amb el servidor.</p>";
      Swal.fire({
        title: `Hi ha aparegut un problema.`,
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
});
document.getElementById('pdf_gen').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const selectedDay = document.getElementById('select-day').value;
  const selectedUsersDiv = document.getElementById('selected-users');

  if (!selectedDay || !selectedUsersDiv.innerText.trim()) {
    Swal.fire({
      icon: 'warning',
      title: 'Cap informació',
      text: 'Selecciona un dia amb seleccions abans de generar el PDF',
    });
    return;
  }

  // Encabezado
  doc.setFontSize(16);
  doc.text(`Informe del menú seleccionat`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Data: ${selectedDay}`, 20, 30);

  // Extraer datos del DOM
  const paragraphs = selectedUsersDiv.querySelectorAll('p');
  let y = 40;

  paragraphs.forEach((p, index) => {
    const text = p.innerText.split('\n');
    text.forEach(line => {
      if (y > 270) { // Nueva página si se pasa
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 7;
    });
    y += 3;
  });

  // Guardar el archivo
  doc.save(`menu_${selectedDay}.pdf`);
});