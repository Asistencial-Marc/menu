
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
