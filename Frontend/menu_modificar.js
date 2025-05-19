const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token || role !== 'cocinero') {
  window.location.href = 'login.html';
}

const menuDayInput = document.getElementById('menu-day');
const form = document.getElementById('edit-menu-form');

// Ocultar el formulario inicialmente
form.style.display = 'none';

menuDayInput.addEventListener('change', async () => {
  const selectedDate = menuDayInput.value;
  if (!selectedDate) return;

  const response = await fetch(`http://localhost:5000/api/menu/${selectedDate}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    Swal.fire({
      title: 'No hi ha menú',
      text: 'No s’ha trobat cap menú per aquest dia',
      icon: 'warning',
      background: '#fffbea',
      color: '#5a4500',
      iconColor: '#f5a623',
      customClass: {
        popup: 'swal-custom-error-popup',
        title: 'swal-custom-error-title',
        text: 'swal-custom-error-text'
      }
    });
    form.style.display = 'none';
    return;
  }

  const data = await response.json();
  form.style.display = 'block';

  document.getElementById('firstOption').value = data.firstOption[0] || '';
  document.getElementById('firstOption2').value = data.firstOption[1] || '';
  document.getElementById('secondOption').value = data.secondOption[0] || '';
  document.getElementById('secondOption2').value = data.secondOption[1] || '';
  document.getElementById('dessertOption').value = data.dessertOption[0] || '';
  document.getElementById('dessertOption2').value = data.dessertOption[1] || '';
});

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const day = menuDayInput.value;

  const payload = {
    day, // Esto es clave
    firstOption: document.getElementById('firstOption').value,
    firstOption2: document.getElementById('firstOption2').value,
    secondOption: document.getElementById('secondOption').value,
    secondOption2: document.getElementById('secondOption2').value,
    dessertOption: document.getElementById('dessertOption').value,
    dessertOption2: document.getElementById('dessertOption2').value
  };

  const response = await fetch(`http://localhost:5000/api/menu/${day}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    Swal.fire({
      title: 'Menú actualitzat',
      text: 'El menú ha estat modificat correctament',
      icon: 'success',
      background: '#f0fff0',
      color: '#2f4f4f',
      iconColor: '#4CAF50',
      timer: 2000,
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
    Swal.fire({
      title: 'Error',
      text: 'No s’ha pogut actualitzar el menú',
      icon: 'error',
      background: '#FFF4F1',
      color: '#503030',
      iconColor: '#B14C4C',
      showConfirmButton: true,
      customClass: {
        popup: 'swal-custom-error-popup',
        title: 'swal-custom-error-title',
        text: 'swal-custom-error-text'
      }
    });
  }
});
