
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
