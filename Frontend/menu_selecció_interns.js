import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return;
  }

  const selectDay = document.getElementById('select-day');
  const selectedUsersDiv = document.getElementById('selected-users');

  selectDay.addEventListener('change', async function () {
    const selectedDay = selectDay.value;
    if (!selectedDay) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/menu_seleccionat/selections/${selectedDay}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      selectedUsersDiv.innerHTML = "";

      if (!response.ok || data.users.length === 0) {
        selectedUsersDiv.innerHTML = "<p>No hi ha seleccions per aquest dia.</p>";
        return;
      }

      const count = {
        firstOption: {},
        secondOption: {},
        dessertOption: {}
      };

      data.users.forEach(user => {
        ['firstOption', 'secondOption', 'dessertOption'].forEach(type => {
          const value = user[type];
          count[type][value] = (count[type][value] || 0) + 1;
        });
      });

      const labels = {
        firstOption: 'Primer plat',
        secondOption: 'Segon plat',
        dessertOption: 'Postres'
      };

      const summaryHTML = `
        <div class="summary-block">
          <h3>Resum de seleccions:</h3>
          ${Object.entries(count).map(([category, options]) =>
            Object.entries(options).map(([option, total]) =>
              `<div class="summary-line"><strong>${labels[category]}:</strong> ${option} → ${total}</div>`
            ).join('')
          ).join('')}
          <hr style="border-top: 2px dashed #c31630; margin: 20px 0;">
        </div>
      `;

      selectedUsersDiv.innerHTML += summaryHTML;

      data.users.forEach(user => {
        const userHTML = `
          <div class="user-card">
            <p><strong>${user.name}</strong></p>
            <p>Primer plat: ${user.firstOption}</p>
            <p>Segon plat: ${user.secondOption}</p>
            <p>Postres: ${user.dessertOption}</p>
            <p><em>Ubicació: ${user.ubicacio || 'No especificada'}</em></p>
          </div>
          <hr style="border-top: 1px solid red; margin: 12px 0;">
        `;
        selectedUsersDiv.innerHTML += userHTML;
      });

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
        }
      });
    }
  });

  // Generar PDF
  document.getElementById('pdf_gen').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

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

    doc.setFontSize(16);
    doc.text(`Informe del menú seleccionat`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Data: ${selectedDay}`, 20, 30);

    let y = 40;
    const blocks = selectedUsersDiv.querySelectorAll('.summary-block .summary-line, .user-card p');

    blocks.forEach((p) => {
      const line = p.innerText;
      if (y > 270) {
        doc.addPage();
        doc.setFont("helvetica", "normal");
        y = 20;
      }
      doc.text(line, 20, y);
      y += 7;

      if (p.parentElement.classList.contains('user-card') &&
          p.nextElementSibling === null && y <= 270) {
        doc.setDrawColor(195, 22, 48);
        doc.line(20, y, 190, y);
        y += 5;
      }
    });

    doc.save(`menu_${selectedDay}.pdf`);
  });
});
