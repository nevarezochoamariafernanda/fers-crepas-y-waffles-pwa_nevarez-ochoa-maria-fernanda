
 // app.js — Fer's Crepas & Waffles
// Mostrar el estado de conexión.

function actualizarPildoraConexion() {
  const pildora = document.getElementById("estado-conexion");

  if (!pildora) return;

  if (navigator.onLine) {
    pildora.textContent = "Conectado";
    pildora.classList.remove("sin-conexion");
  } else {
    pildora.textContent = "Sin conexión";
    pildora.classList.add("sin-conexion");
  }
}

document.addEventListener("DOMContentLoaded", actualizarPildoraConexion);
window.addEventListener("online", actualizarPildoraConexion);
window.addEventListener("offline", actualizarPildoraConexion);
