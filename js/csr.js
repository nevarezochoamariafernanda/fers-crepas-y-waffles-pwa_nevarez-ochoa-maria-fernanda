// csr.js — Renderizado en el Cliente (CSR)
// "CSR" significa que el HTML llega casi vacío y es ESTE archivo JavaScript,
// ya corriendo en el navegador del usuario, quien construye el contenido.

// 1) Buscamos el contenedor vacío que dejamos en index.html
const contenedorCatalogo = document.getElementById("catalogo");

// 2) fetch() le pide el archivo catalogo.json al servidor (aquí simula una API real).
//    fetch() devuelve una "promesa": un valor que llegará más adelante, no de inmediato.
fetch("catalogo.json")
  .then((respuesta) => respuesta.json())
  .then((productos) => {
    contenedorCatalogo.innerHTML = "";
    contenedorCatalogo.removeAttribute("aria-busy");
    contenedorCatalogo.removeAttribute("aria-label");

    productos.forEach((producto) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "producto";
      tarjeta.dataset.categoria = producto.categoria;
      tarjeta.innerHTML = `
        <img class="producto__foto" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
        <strong>${producto.nombre}</strong>
        <span class="precio">$${producto.precio}</span>
        <p>Stock: ${producto.stock}</p>
        <button type="button" data-id="${producto.id}">Agregar al carrito</button>
      `;
      contenedorCatalogo.appendChild(tarjeta);
      tarjeta.querySelector("button").addEventListener("click", () => {
        agregarAlCarrito(producto);
      });
    });

    crearFiltros(productos);
  })
  .catch((error) => {
    contenedorCatalogo.innerHTML = "<p>No se pudo cargar el catálogo. Intenta más tarde.</p>";
    contenedorCatalogo.removeAttribute("aria-busy");
    contenedorCatalogo.removeAttribute("aria-label");
    console.error("Error al cargar catálogo:", error);
  });

function crearFiltros(productos) {
  const categorias = [...new Set(productos.map((p) => p.categoria))];

  const barra = document.createElement("div");
  barra.className = "filtros";
  barra.setAttribute("role", "group");
  barra.setAttribute("aria-label", "Filtrar por categoría");

  ["Todos", ...categorias].forEach((categoria) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = categoria;
    boton.setAttribute("aria-pressed", categoria === "Todos" ? "true" : "false");

    boton.addEventListener("click", () => {
      barra.querySelectorAll("button").forEach((b) =>
        b.setAttribute("aria-pressed", "false")
      );
      boton.setAttribute("aria-pressed", "true");

      contenedorCatalogo
        .querySelectorAll(".producto")
        .forEach((tarjeta) => {
          tarjeta.hidden =
            categoria !== "Todos" &&
            tarjeta.dataset.categoria !== categoria;
        });
    });

    barra.appendChild(boton);
  });

  contenedorCatalogo.before(barra);
}