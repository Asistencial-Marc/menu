import { API_BASE_URL } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'administrador') {
    return window.location.href = '/login';
  }

  const container = document.querySelector('.container');

  // Crear input de búsqueda
 
  // Crear título
  const title = document.createElement('h2');
  title.textContent = 'Eliminar un usuari';
  container.appendChild(title);

 const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Cerca per nom...';
  searchInput.style.margin = '20px auto';
  searchInput.style.display = 'block';
  container.appendChild(searchInput);


  // Contenedor de usuarios
  const userList = document.createElement('div');
  userList.id = 'user-list';
  container.appendChild(userList);

  let allUsers = [];

  async function loadUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/llista-usuaris`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      allUsers = data.users;
      renderUsers(allUsers);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No s\'han pogut carregar els usuaris', 'error');
    }
  }

  function renderUsers(users) {
    userList.innerHTML = '';

    if (users.length === 0) {
      userList.innerHTML = '<p>No s\'han trobat usuaris</p>';
      return;
    }

    users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'user-card';
      card.innerHTML = `
        <strong>${user.name}</strong><br>
        Codi: ${user.codi}<br>
        Email: ${user.email || 'No disponible'}<br>
        <button class="delete-user" data-id="${user._id}">Eliminar</button>
      `;
      userList.appendChild(card);
    });

    document.querySelectorAll('.delete-user').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const confirm = await Swal.fire({
          title: 'Estàs segur?',
          text: 'Això eliminarà definitivament el compte.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancel·lar'
        });

        if (confirm.isConfirmed) {
          try {
            const delRes = await fetch(`${API_BASE_URL}/api/admin/eliminar-usuari/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });

            const delData = await delRes.json();

            if (delRes.ok) {
              Swal.fire('Eliminat!', 'L\'usuari ha estat eliminat.', 'success');
              loadUsers();
            } else {
              Swal.fire('Error', delData.message, 'error');
            }
          } catch (err) {
            Swal.fire('Error', 'No s\'ha pogut eliminar l\'usuari.', 'error');
          }
        }
      });
    });
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query === '') {
      renderUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.name.toLowerCase().startsWith(query)
      );
      renderUsers(filtered);
    }
  });

  loadUsers();
});
