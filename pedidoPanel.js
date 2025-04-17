// Ya importado tras pedidoModule.js en HTML

function abrirClienteModal() {
  document.getElementById("clienteModal").style.display = "flex";
  document.getElementById("detalleModal").style.display = "none";
}
function cerrarClienteModal() {
  document.getElementById("clienteModal").style.display = "none";
}
function guardarCliente() {
  const nom = document.getElementById("cliente-nombre").value.trim();
  if (!nom) return alert("Nombre obligatorio");
  // lee todos los campos
  clienteData = {
    nombre: nom,
    telefono: document.getElementById("cliente-telefono").value,
    direccion: document.getElementById("cliente-direccion").value,
    localidad: document.getElementById("cliente-localidad").value,
    cp: document.getElementById("cliente-cp").value,
    provincia: document.getElementById("cliente-provincia").value,
    email: document.getElementById("cliente-email").value,
    cuit: document.getElementById("cliente-cuit").value,
    condIVA: document.getElementById("cliente-cond-iva").value
  };
  cerrarClienteModal();
  document.getElementById("btnAgregarArticulo").style.display = "block";
  alert("✅ Cliente registrado. Ahora podés agregar artículos.");
}

function abrirDetalleModal() {
  document.getElementById("detalleModal").style.display = "flex";
  document.getElementById("clienteModal").style.display = "none";
  renderizarDetallePedido();
}
function cerrarDetalleModal() {
  document.getElementById("detalleModal").style.display = "none";
}

function renderizarDetallePedido() {
  // Asigna el nombre de cliente cargado
  document.getElementById('detalleClienteNombre').textContent = clienteData.nombre || '';
  const tbody = document.querySelector("#tablaDetalle tbody");
  tbody.innerHTML = "";
  let total = 0;
  pedidoActual.forEach((it, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${it.articulo}</td>
      <td>${it.color}</td>
      <td><input type="number" value="${it.cantidad}" min="1" onchange="actualizarCantidad(${i},this.value)"></td>
      <td>${it.observaciones||''}</td>
      <td>
        <button onclick="actualizarCantidadPrompt(${i})">✏️</button>
        <button onclick="eliminarLinea(${i})">❌</button>
      </td>
    `;
    tbody.appendChild(tr);
    total += it.cantidad;
  });
  document.getElementById("totalPares").textContent = `Total: ${total} pares`;
}

function actualizarCantidad(i, v) {
  const c = parseInt(v);
  if (c>0) { pedidoActual[i].cantidad = c; renderizarDetallePedido(); }
}
function actualizarCantidadPrompt(i) {
  const v = prompt("Nueva cantidad:", pedidoActual[i].cantidad);
  actualizarCantidad(i, v);
}
function eliminarLinea(i) {
  pedidoActual.splice(i,1);
  renderizarDetallePedido();
}

function guardarPedidoFinal() {
  if (pedidoActual.length===0) {
    alert("No hay artículos en el pedido.");
    return;
  }
  // aquí exportar XLSX o compartir
  alert("✅ Pedido listo para exportar.");
  // reiniciar todo
  pedidoActual = [];
  clienteData = null;
  cerrarDetalleModal();
  document.getElementById("btnAgregarArticulo").style.display = "none";
}

function formatearCUIT(input) {
  // 1) extrae sólo dígitos, máxima longitud 11
  let raw = (input.value.match(/\d/g) || []).slice(0, 11).join('');

  // 2) construye el valor formateado
  let formatted = raw;
  if (raw.length > 2 && raw.length < 11) {
    // tras dos dígitos, inserta primer guion
    formatted = raw.slice(0, 2) + '-' + raw.slice(2);
  } else if (raw.length === 11) {
    // exactamente 11: XX-XXXXXXXX-X
    formatted = raw.slice(0, 2) + '-' + raw.slice(2, 10) + '-' + raw.slice(10);
  }

  // 3) actualiza el campo
  input.value = formatted;

  // 4) muestra/oculta Cond. IVA sólo si completó 11 dígitos
  document.getElementById('label-cond-iva').style.display =
    (raw.length === 11) ? 'block' : 'none';
}
