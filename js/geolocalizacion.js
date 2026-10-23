
 // geolocalizacion.js — Fer's Crepas & Waffles
// Geolocalización del cliente y ruta a la sucursal.

// Ubicación simulada para el proyecto escolar.
// No representa la dirección exacta de una sucursal real.
const SUCURSAL = {
  nombre: "Fer's Crepas & Waffles",
  direccion: "Blvd. del Sol #245, Col. Las Flores, Hermosillo, Sonora",
  lat: 29.0729,
  lon: -110.9559
};

// Calcula la distancia en línea recta en kilómetros.
function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const radioTierraKm = 6371;
  const rad = grados => grados * Math.PI / 180;

  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) *
    Math.cos(rad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return radioTierraKm *
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Obtiene una ruta por calles mediante OSRM.
async function obtenerRuta(lat, lon) {
  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    `${lon},${lat};${SUCURSAL.lon},${SUCURSAL.lat}` +
    "?overview=full&geometry=geojson";

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) return null;

    const datos = await respuesta.json();

    if (datos.code !== "Ok" || !datos.routes?.length) {
      return null;
    }

    const ruta = datos.routes[0];

    return {
      coords: ruta.geometry.coordinates.map(
        ([longitud, latitud]) => [latitud, longitud]
      ),
      distanciaKm: ruta.distance / 1000,
      duracionMin: ruta.duration / 60
    };
  } catch (error) {
    console.error("Error al calcular la ruta:", error);
    return null;
  }
}

let mapa;
let capaRuta;

// Dibuja el mapa con la posición del cliente y la sucursal.
function dibujarMapa(lat, lon, coordsRuta) {
  const contenedor = document.getElementById("mapa-ruta");

  contenedor.hidden = false;

  if (!mapa) {
    mapa = L.map(contenedor);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19
      }
    ).addTo(mapa);
  }

  if (capaRuta) {
    mapa.removeLayer(capaRuta);
  }

  capaRuta = L.layerGroup().addTo(mapa);

  const cliente = [lat, lon];
  const sucursal = [SUCURSAL.lat, SUCURSAL.lon];

  L.marker(cliente)
    .addTo(capaRuta)
    .bindPopup("Tu ubicación");

  L.marker(sucursal)
    .addTo(capaRuta)
    .bindPopup(SUCURSAL.nombre + " (ubicación simulada)");

  const puntos = coordsRuta || [cliente, sucursal];

  const linea = L.polyline(puntos, {
    color: coordsRuta ? "#e46191" : "#F59E0B",
    weight: 5,
    dashArray: coordsRuta ? null : "7 7"
  }).addTo(capaRuta);

  mapa.fitBounds(linea.getBounds(), {
    padding: [30, 30]
  });

  setTimeout(() => mapa.invalidateSize(), 100);
}

// Solicita permiso al usuario para obtener su ubicación.
document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("btn-ubicacion");
  const mensaje = document.getElementById("ubicacion-mensaje");

  if (!boton || !mensaje) return;

  boton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      mensaje.textContent =
        "Tu navegador no permite obtener la ubicación.";
      return;
    }

    if (typeof L === "undefined") {
      mensaje.textContent =
        "No se pudo cargar el mapa de Leaflet.";
      return;
    }

    mensaje.textContent = "Buscando tu ubicación...";

    navigator.geolocation.getCurrentPosition(
      async posicion => {
        const lat = posicion.coords.latitude;
        const lon = posicion.coords.longitude;

        mensaje.textContent =
          "Calculando la ruta a Fer's Crepas & Waffles...";

        const ruta = await obtenerRuta(lat, lon);

        dibujarMapa(lat, lon, ruta ? ruta.coords : null);

        if (ruta) {
          mensaje.textContent =
            `Distancia aproximada: ${ruta.distanciaKm.toFixed(2)} km. ` +
            `Tiempo estimado en auto: ${Math.round(ruta.duracionMin)} minutos. ` +
            "Destino simulado para fines escolares.";
        } else {
          const distancia = calcularDistanciaKm(
            lat, lon, SUCURSAL.lat, SUCURSAL.lon
          );

          mensaje.textContent =
            `Distancia en línea recta: ${distancia.toFixed(2)} km. ` +
            "Ubicación de sucursal simulada para fines escolares.";
        }
      },
      error => {
        mensaje.textContent =
          "No se pudo obtener tu ubicación: " + error.message;
      },
      {
        enableHighAccuracy: true,
        timeout: 15000
      }
    );
  });
});
