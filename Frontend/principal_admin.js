
document.getElementById("btnimport").addEventListener("click", () => {
    window.location.href = "/importar_usuaris"; // cambia al nombre correcto si es otro
});

document.getElementById("btnregistrat").addEventListener("click", () => {
    window.location.href = "/register"; // cambia al nombre correcto si es otro
});

document.getElementById("btnenviar").addEventListener("click", () => {
    window.location.href = "/importar_informe"; // cambia al nombre correcto si es otro
});

document.getElementById("btneliminar").addEventListener("click", () => {
    window.location.href = "/usuari_eliminar"; // cambia al nombre correcto si es otro
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
