document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = '/login';
  
    const dayInput = document.getElementById('menu-day');
    const deleteBtn = document.getElementById('delete-button');
    const menuDetails = document.getElementById('menu-details');
  
    dayInput.addEventListener('change', async () => {
      const selectedDay = dayInput.value;
      if (!selectedDay) return;
  
      try {
        const res = await fetch(`http://localhost:5000/api/menu_seleccionat/day/${selectedDay}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
  
        if (!res.ok) {
          Swal.fire('Sense selecció', 'No hi ha selecció per aquest dia.', 'info');
          menuDetails.style.display = 'none';
          deleteBtn.style.display = 'none';
          return;
        }
  
        const data = await res.json();
  
        document.getElementById('firstOption').textContent = data.firstOption;
        document.getElementById('secondOption').textContent = data.secondOption;
        document.getElementById('dessertOption').textContent = data.dessertOption;
        menuDetails.style.display = 'block';
  
        // Comprobar si la fecha es posterior a hoy
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(selectedDay);
        selectedDate.setHours(0, 0, 0, 0);
  
        if (selectedDate > today) {
          deleteBtn.style.display = 'block';
  
          deleteBtn.onclick = async () => {
            const confirm = await Swal.fire({
              title: 'Confirmes eliminar la selecció?',
              showCancelButton: true,
              confirmButtonText: 'Sí, eliminar',
              cancelButtonText: 'Cancel·lar'
            });
  
            if (confirm.isConfirmed) {
                const delRes = await fetch(`http://localhost:5000/api/menu_seleccionat/delete/${selectedDay}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
  
              if (delRes.ok) {
                Swal.fire('Eliminat', 'Selecció eliminada correctament.', 'success');
                menuDetails.style.display = 'none';
                deleteBtn.style.display = 'none';
              } else {
                Swal.fire('Error', 'No s\'ha pogut eliminar.', 'error');
              }
            }
          };
  
        } else {
          deleteBtn.style.display = 'none';
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Hi ha hagut un problema amb la connexió.', 'error');
      }
    });
  });
