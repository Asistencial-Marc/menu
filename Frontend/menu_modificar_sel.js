import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/login';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectDay = document.getElementById('select-day');
  const form = document.getElementById('modify-menu-form');

  selectDay.addEventListener('change', async () => {
    const selectedDate = new Date(selectDay.value);
    if (selectedDate <= today) {
      Swal.fire('No permès', 'Només pots modificar menús a partir de demà.', 'warning');
      form.style.display = 'none';
      return;
    }

    try {
      const resMenu = await fetch(`${API_BASE_URL}/api/menu/${selectDay.value}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!resMenu.ok) {
        form.style.display = 'none';
        return Swal.fire('No hi ha menú', 'No s\'ha trobat cap menú per aquest dia', 'warning');
      }

      const menuData = await resMenu.json();
      const first = document.getElementById('firstOption');
      const second = document.getElementById('secondOption');
      const dessert = document.getElementById('dessertOption');

      first.innerHTML = '';
      second.innerHTML = '';
      dessert.innerHTML = '';

      menuData.firstOption.forEach(opt => {
        first.innerHTML += `<option value="${opt}">${opt}</option>`;
      });
      menuData.secondOption.forEach(opt => {
        second.innerHTML += `<option value="${opt}">${opt}</option>`;
      });
      menuData.dessertOption.forEach(opt => {
        dessert.innerHTML += `<option value="${opt}">${opt}</option>`;
      });

      form.style.display = 'block';
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Error al carregar el menú', 'error');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      day: selectDay.value,
      firstOption: document.getElementById('firstOption').value,
      secondOption: document.getElementById('secondOption').value,
      dessertOption: document.getElementById('dessertOption').value,
      ubicacio: document.getElementById('ubicacio').value
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/menu_seleccionat/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire('Actualitzat', 'Selecció modificada amb èxit', 'success');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      Swal.fire('Error', err.message || 'Error al modificar la selecció', 'error');
    }
  });
});
