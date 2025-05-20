import { API_BASE_URL } from './config.js';
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return (window.location.href = '/login');
  
    const monthInput = document.getElementById('month');
    const menuList = document.getElementById('menu-list');
  
    monthInput.addEventListener('change', async () => {
      const [year, month] = monthInput.value.split('-');
      const daysInMonth = new Date(year, month, 0).getDate();
  
      menuList.innerHTML = '';
  
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${month.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
        const response = await fetch(`${API_BASE_URL}/api/menu/${date}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
  
        const item = document.createElement('div');
        item.classList.add('day-item');
  
        if (response.ok) {
          const data = await response.json();
          item.innerHTML = `
            <h3>${date}</h3>
            <p><strong>Primers:</strong> ${data.firstOption.join(', ')}</p>
            <p><strong>Segons:</strong> ${data.secondOption.join(', ')}</p>
            <p><strong>Postres:</strong> ${data.dessertOption.join(', ')}</p>
          `;
        } else {
          item.innerHTML = `<h3>${date}</h3><p class="not-available">Menú no disponible</p>`;
        }
  
        menuList.appendChild(item);
      }
    });
  });
  