const token = localStorage.getItem('token');
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
document.getElementById("btn_afegir_menu").addEventListener("click", () => {
    window.location.href = "/menu";
});

document.getElementById("btn_mirar_empleats").addEventListener("click", () => {
    window.location.href = "/menu_selecció_interns";
});

document.getElementById("btnModificar").addEventListener("click", () => {
    window.location.href = "/menu_modificar"; // cambia al nombre correcto si es otro
});

document.getElementById("btn_veure_mes").addEventListener("click", () => {
    window.location.href = "/veure_dietas"; // cambia al nombre correcto si es otro
});


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

function mostrarModalConfidencialitat() {
  document.getElementById("modalConfidencialitat").style.display = "flex";
}

function acceptarConfidencialitat() {
  fetch('/api/auth/accepta_confidencialitat', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(res => {
    if (res.ok) {
      document.getElementById("modalConfidencialitat").style.display = "none";
    } else {
      alert("Error en acceptar l'acord de confidencialitat");
    }
  });
}