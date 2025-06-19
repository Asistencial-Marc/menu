const token = localStorage.getItem('token');

document.getElementById("btnSeleccionar").addEventListener("click", () => {
    window.location.href = "/menu_usuari"; // cambia al nombre correcto si es otro
});

document.getElementById("btnMirar").addEventListener("click", () => {
    window.location.href = "/menu_proxims_7_dies"; // cambia al nombre correcto si es otro
});

document.getElementById("btnModificar").addEventListener("click", () => {
    window.location.href = "/menu_modificar_sel"; // cambia al nombre correcto si es otro
});

document.getElementById("btnEliminar").addEventListener("click", () => {
    window.location.href = "/usuari_eliminar_menu"; // cambia al nombre correcto si es otro
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}

function mostrarModalPolitica() {
  document.getElementById("modalPolitica").style.display = "flex";
}

function acceptarPolitica() {
  fetch('/api/auth/acepta_politica', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(res => {
    if (res.ok) {
      document.getElementById("modalPolitica").style.display = "none";
    } else {
      alert("Error en acceptar la política de privacitat");
    }
  });
}

fetch('/api/auth/user-info', {
  headers: { 'Authorization': 'Bearer ' + token }
})
.then(res => res.json())
.then(user => {
  if (!user.politicaPrivacitatAcceptada) {
    mostrarModalPolitica();
  } else if ((user.role === 'cocinero' || user.role === 'administrador') && !user.confidencialitatAcceptada) {
    mostrarModalConfidencialitat();
  }
});
