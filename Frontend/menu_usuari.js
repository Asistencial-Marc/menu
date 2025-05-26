import { API_BASE_URL } from './config.js';
// Cuando cambia el día seleccionado
document.getElementById('select-day').addEventListener('change', async function(event) {
  const selectedDate = event.target.value;

  if (!selectedDate) {
    document.getElementById('menu-details').textContent = "Selecciona una data para ver el menú.";
    return;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return;
  }

  // Hacer la solicitud para obtener el menú del día seleccionado enviando el token
  const response = await fetch(`${API_BASE_URL}/api/menu/${selectedDate}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (response.ok) {
    // Mostrar las opciones de menú para el día seleccionado
    const menuDetails = document.getElementById('menu-details');
    menuDetails.textContent = `Menú del dia ${selectedDate}:`;

    const firstOptionSelect = document.getElementById('firstOption');
    const secondOptionSelect = document.getElementById('secondOption');
    const dessertOptionSelect = document.getElementById('dessertOption');

    firstOptionSelect.innerHTML = '<option value="">Selecciona un primer plat</option>';
    secondOptionSelect.innerHTML = '<option value="">Selecciona un segon plat</option>';
    dessertOptionSelect.innerHTML = '<option value="">Selecciona un postre</option>';

    data.firstOption.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      firstOptionSelect.appendChild(optionElement);
    });

    data.secondOption.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      secondOptionSelect.appendChild(optionElement);
    });

    data.dessertOption.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option;
      dessertOptionSelect.appendChild(optionElement);
    });
  } else {
    document.getElementById('menu-details').textContent = "Menú no disponible para este día.";
  }
});

// Guardar la selección del usuario
document.getElementById('menu-selection-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const selectedDate = document.getElementById('select-day').value;
  const firstOption = document.getElementById('firstOption').value;
  const secondOption = document.getElementById('secondOption').value;
  const dessertOption = document.getElementById('dessertOption').value;
  const ubicacio = document.getElementById('ubicacio').value;

  console.log(selectedDate , " ", firstOption, " ", secondOption, " " ,dessertOption);
  if (!firstOption || !secondOption || !dessertOption || !ubicacio) {
    console.log('Si us plau, selecciona totes les opcions del menú.');
    Swal.fire({
      title: `Ups.`,
      text: `Si us plau, selecciona una de cada de les opcions del menú.`,
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
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return;
  }

  const checkResponse = await fetch(`${API_BASE_URL}/api/menu_seleccionat/check/${selectedDate}`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const checkData = await checkResponse.json();

  if (checkResponse.ok && checkData.alreadySelected) {
    return Swal.fire({
      title: 'Ja has seleccionat menú per aquest dia',
      text: 'No pots tornar a seleccionar per aquest dia.',
      icon: 'warning', background: '#FFF4F1', color: '#503030', iconColor: '#B14C4C',
      showConfirmButton: true
    });
  }

  // Realizar la solicitud para guardar la selección en la base de datos
  const response = await fetch(`${API_BASE_URL}/api/menu_seleccionat/select`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      day: selectedDate,
      firstOption,
      secondOption,
      dessertOption,
      ubicacio
    })
  });

  const data = await response.json();

  if (response.ok) {
    console.log('Selecció guardada amb èxit!');
    Swal.fire({
      title: `Selecció guardada amb èxit!`,
      text: `S'ha desat les opcions selecionades`,
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
  window.location.href = '/principal_usuaris';  // Redirige al login después de registrarse
    });
  } else {
    console.log('Error al guardar la selecció: ' + data.message);
    Swal.fire({
      title: `Error al guardar la selecció.`,
      text: `Si us plau, assegurat de no deixar cap camp buit ${data.message}.`,
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
