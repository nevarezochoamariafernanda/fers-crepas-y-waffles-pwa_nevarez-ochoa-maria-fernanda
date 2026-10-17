
// carrito.js — Fer's Crepas & Waffles
// Almacenamiento local y sincronización offline/online

const CLAVE_CARRITO = "fers-crepas-carrito";

// Lee el carrito guardado en localStorage
function leerCarrito() {
  const guardado = localStorage.getItem(CLAVE_CARRITO);
  return guardado ? JSON.parse(guardado) : [];
}

// Guarda el carrito en localStorage
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Agrega un producto o aumenta su cantidad
function agregarAlCarrito(producto) {
  const carrito = leerCarrito();
  const existente = carrito.find((item) => item.id === producto.id);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  pintarCarrito();
}

// Aumenta o disminuye la cantidad de un producto
function cambiarCantidad(id, delta) {
  const carrito = leerCarrito();
  const item = carrito.find((item) => item.id === id);

  if (!item) return;

  item.cantidad += delta;

  const actualizado = item.cantidad <= 0
    ? carrito.filter((item) => item.id !== id)
    : carrito;

  guardarCarrito(actualizado);
  pintarCarrito();
}

// Elimina un producto del carrito
function quitarDelCarrito(id) {
  const carrito = leerCarrito().filter((item) => item.id !== id);

  guardarCarrito(carrito);
  pintarCarrito();
}

// Muestra los productos del carrito y calcula el total
function pintarCarrito() {
  const carrito = leerCarrito();
  const lista = document.getElementById("carrito-lista");
  const total = document.getElementById("carrito-total");

  lista.innerHTML = "";
  let suma = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    suma += subtotal;

    const li = document.createElement("li");

    li.innerHTML = `
      <span class="carrito-nombre">${item.nombre}</span>

      <span class="carrito-cantidad">
        <button
          type="button"
          data-accion="restar"
          data-id="${item.id}"
          aria-label="Quitar una unidad de ${item.nombre}"
        >−</button>

        <span class="carrito-cantidad__valor">
          ${item.cantidad}
        </span>

        <button
          type="button"
          data-accion="sumar"
          data-id="${item.id}"
          aria-label="Agregar una unidad de ${item.nombre}"
        >+</button>
      </span>

      <span class="carrito-precio">
        $${subtotal.toFixed(2)}
      </span>

      <button
        type="button"
        class="carrito-quitar"
        data-accion="quitar"
        data-id="${item.id}"
      >
        Quitar
      </button>
    `;

    lista.appendChild(li);
  });

  total.textContent = suma.toFixed(2);
}

// Controla los botones +, − y Quitar
function manejarClicCarrito(evento) {
  const boton = evento.target.closest("button[data-accion]");

  if (!boton) return;

  const id = Number(boton.dataset.id);

  if (boton.dataset.accion === "sumar") {
    cambiarCantidad(id, 1);
  }

  if (boton.dataset.accion === "restar") {
    cambiarCantidad(id, -1);
  }

  if (boton.dataset.accion === "quitar") {
    quitarDelCarrito(id);
  }
}

// Simula la sincronización del carrito
function sincronizarCarrito() {
  const mensaje = document.getElementById("carrito-mensaje");

  if (!navigator.onLine) {
    mensaje.textContent =
      "Sin conexión: el carrito se sincronizará cuando vuelva el internet.";
    return;
  }

  // En una aplicación real aquí se enviarían los datos al servidor.
  mensaje.textContent =
    "Carrito guardado localmente. Sincronización con servidor simulada. ✓";
}

// Inicializa el carrito cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
  pintarCarrito();

  document
    .getElementById("carrito-lista")
    .addEventListener("click", manejarClicCarrito);

  document
    .getElementById("btn-sincronizar")
    .addEventListener("click", sincronizarCarrito);

  // Detecta cuando regresa la conexión
  window.addEventListener("online", sincronizarCarrito);

  // Detecta cuando se pierde la conexión
  window.addEventListener("offline", () => {
    document.getElementById("carrito-mensaje").textContent =
      "Se perdió la conexión. Tu pedido sigue guardado.";
  });
});
