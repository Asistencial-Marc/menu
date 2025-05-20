import { API_BASE_URL } from './config.js';
const menuWeekDiv = document.getElementById('menu-week');

function getFormattedDate(date) {
  return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

function getDayName(date) {
  const days = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];
  return days[date.getDay()];
}

async function fetchMenuForDate(dateString) {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/menu/${dateString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      return await response.json(); // Si OK, devuelve el menú
    } else {
      return null; // Si no OK, devuelve null
    }
  } catch (error) {
    console.error(`Error al obtener menú para ${dateString}:`, error);
    Swal.fire({
      title: `Error al obtener menú para ${dateString}:.`,
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
    return null; // Si falla, devuelve null
  }
}

async function createMenuForWeek() {
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date();
    dayDate.setDate(today.getDate() + i);

    const dayName = getDayName(dayDate);
    const formattedDate = getFormattedDate(dayDate);

    const dayDiv = document.createElement('div');
    dayDiv.className = 'day-item';

    const menuData = await fetchMenuForDate(formattedDate);

    // Aunque no haya menú, creamos la tarjeta
    if (menuData) {
      dayDiv.innerHTML = `
        <h3>${dayName} - ${formattedDate}</h3>
        <p><strong>Primer plat:</strong>  1: ${menuData.firstOption[0]} |  2: ${menuData.firstOption[1]}</p>
        <p><strong>Segon plat:</strong>  1: ${menuData.secondOption[0]} |  2: ${menuData.secondOption[1]}</p>
        <p><strong>Postres:</strong>  1: ${menuData.dessertOption[0]} |  2: ${menuData.dessertOption[1]}</p>
      `;
    } else {
      dayDiv.innerHTML = `
        <h3>${dayName} - ${formattedDate}</h3>
        <p><strong>Primer plat:</strong> <span class="not-available">No disponible</span></p>
        <p><strong>Segon plat:</strong> <span class="not-available">No disponible</span></p>
        <p><strong>Postres:</strong> <span class="not-available">No disponible</span></p>
      `;
    }

    menuWeekDiv.appendChild(dayDiv);
  }
}

document.addEventListener('DOMContentLoaded', createMenuForWeek);
