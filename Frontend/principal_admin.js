
document.getElementById("btnimport").addEventListener("click", () => {
    window.location.href = "/importar_usuaris"; // cambia al nombre correcto si es otro
});

document.getElementById("btnregistrat").addEventListener("click", () => {
    window.location.href = "/register"; // cambia al nombre correcto si es otro
});

document.getElementById("btnenviar").addEventListener("click", () => {
    window.location.href = "/importar_informe"; // cambia al nombre correcto si es otro
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
}
