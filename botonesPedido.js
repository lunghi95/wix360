
// UI y lógica de botones de pedido en visor360
let cabeceraCargada = false;

function inicializarBotonesPedido() {
  const container = document.createElement("div");
  container.id = "pedido-buttons";
  container.style.position = "absolute";
  container.style.top = "20px";
  container.style.left = "20px";
  container.style.zIndex = "9999";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "10px";

  // Botón Pedido
  const btnPedido = document.createElement("button");
  btnPedido.textContent = "📝 Pedido";
  btnPedido.style.padding = "8px 14px";
  btnPedido.style.fontSize = "14px";
  btnPedido.style.borderRadius = "5px";
  btnPedido.style.border = "none";
  btnPedido.style.cursor = "pointer";
  btnPedido.style.backgroundColor = "#007bff";
  btnPedido.style.color = "white";
  btnPedido.onclick = () => {
    if (!cabeceraCargada) {
      cargarCabeceraPedido();
    } else {
      abrirPanelPedido();
    }
  };

  // Botón Agregar Artículo (oculto al inicio)
  const btnAgregar = document.createElement("button");
  btnAgregar.id = "btnAgregarArticulo";
  btnAgregar.textContent = "➕ Agregar Artículo";
  btnAgregar.style.padding = "8px 14px";
  btnAgregar.style.fontSize = "14px";
  btnAgregar.style.borderRadius = "5px";
  btnAgregar.style.border = "none";
  btnAgregar.style.cursor = "pointer";
  btnAgregar.style.backgroundColor = "#28a745"; // verde
  btnAgregar.style.color = "white";
  btnAgregar.style.display = "none";
  btnAgregar.onclick = () => {
    if (typeof currentIndex !== 'undefined') {
      agregarProductoActual(currentIndex.toString().padStart(2, '0'));
    } else {
      alert("No se detectó producto activo.");
    }
  };

  container.appendChild(btnPedido);
  container.appendChild(btnAgregar);
  document.body.appendChild(container);
}

function cargarCabeceraPedido() {
  // Por ahora solo simula validación de cabecera
  const nombre = prompt("Ingrese el nombre del cliente:");
  if (!nombre || nombre.length < 2) {
    alert("Por favor, ingresá un nombre válido.");
    return;
  }

  clienteData.nombre = nombre;
  cabeceraCargada = true;

  document.getElementById("btnAgregarArticulo").style.display = "block";
  alert("✅ Cabecera cargada correctamente. Ahora podés agregar artículos al pedido.");
}

window.addEventListener("DOMContentLoaded", () => {
  inicializarBotonesPedido();
});
