
 // notificaciones.js — Fer's Crepas & Waffles
// Solicita permiso para mostrar notificaciones.

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-notificar");
  const mensaje = document.getElementById("notificaciones-mensaje");

  if (!boton || !mensaje) return;

  boton.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      mensaje.textContent =
        "Este navegador no soporta notificaciones.";
      return;
    }

    try {
      const permiso = await Notification.requestPermission();

      if (permiso === "granted") {
        new Notification("Fer's Crepas & Waffles 🧇", {
          body: "¡Notificaciones activadas! Entérate de nuestras novedades y promociones.",
          icon: "icons/icon.png"
        });

        mensaje.textContent =
          "¡Notificaciones activadas correctamente! ✓";
      } else {
        mensaje.textContent =
          "No se concedió permiso para las notificaciones.";
      }
    } catch (error) {
      mensaje.textContent =
        "No fue posible mostrar la notificación.";
      console.error(error);
    }
  });
});
