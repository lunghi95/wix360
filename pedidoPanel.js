// Ya importado tras pedidoModule.js en HTML

function abrirClienteModal() {
  // Si ya existe clienteData, vuelca sus valores en el formulario
  if (clienteData) {
    document.getElementById("cliente-nombre").value     = clienteData.nombre     || "";
    document.getElementById("cliente-telefono").value  = clienteData.telefono   || "";
    document.getElementById("cliente-direccion").value = clienteData.direccion  || "";
    document.getElementById("cliente-localidad").value = clienteData.localidad  || "";
    document.getElementById("cliente-cp").value        = clienteData.cp         || "";
    document.getElementById("cliente-provincia").value = clienteData.provincia  || "";
    document.getElementById("cliente-email").value     = clienteData.email      || "";

    // CUIT y Cond. IVA
    document.getElementById("cliente-cuit").value      = clienteData.cuit       || "";
    const labelIVA = document.getElementById("label-cond-iva");
    if ((clienteData.cuit || "").replace(/\D/g,"").length === 11) {
      labelIVA.style.display = "block";
      document.getElementById("cliente-cond-iva").value = clienteData.condIVA || "";
    } else {
      labelIVA.style.display = "none";
    }

    // Nuevos campos Expreso, Cond. Venta y Vendedor
    document.getElementById("cliente-expreso").value   = clienteData.expreso    || "";
    document.getElementById("cliente-condventa").value = clienteData.condVenta  || "";
    document.getElementById("cliente-vendedor").value  = clienteData.vendedor   || "";
  }

  // Finalmente, muestra el modal
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
    condIVA: document.getElementById("cliente-cond-iva").value,
    expreso: document.getElementById("cliente-expreso").value,
    condVenta: document.getElementById("cliente-condventa").value,
    vendedor: document.getElementById("cliente-vendedor").value
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
        <button onclick="editarObservacionesPrompt(${i})">✏️</button>
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

function editarObservacionesPrompt(i) {
  const actual = pedidoActual[i].observaciones || '';
  const nueva = prompt("Editar observaciones (Talle, detalles, etc.):", actual);
  // Si el usuario no canceló y puso algo (o vació la obs)
  if (nueva !== null) {
    pedidoActual[i].observaciones = nueva;
    renderizarDetallePedido();
  }
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

function fitTextInInput(input) {
  // 0) Reset inline para partir siempre del tamaño CSS original
  input.style.fontSize = '';

  // 1) Leo el tamaño original desde CSS
  const computed     = getComputedStyle(input);
  const originalSize = parseFloat(computed.fontSize) || 16;
  const minSize      = 8;

  // 2) Toma el tamaño actual inline (o el original si no hay override)
  let fontSize = parseFloat(input.style.fontSize) || originalSize;

  // 3) Reducir hasta que quepa o hasta el mínimo
  while (input.scrollWidth > input.clientWidth && fontSize > minSize) {
    fontSize = Math.max(fontSize - 0.5, minSize);
    input.style.fontSize = fontSize + 'px';
  }

  // 4) Aumentar hasta el original, pero sin provocar overflow
  while (fontSize < originalSize) {
    const next = fontSize + 0.5;
    input.style.fontSize = next + 'px';
    if (input.scrollWidth > input.clientWidth) {
      // si rebasa, deshacer ese último +0.5px y salir
      input.style.fontSize = fontSize + 'px';
      break;
    }
    fontSize = next;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const campos = document.querySelectorAll('#clienteModal input, #clienteModal select');
  campos.forEach(input => {
    input.addEventListener('focus', () => {
      // al enfocar quitamos cualquier override inline
      input.style.fontSize = '';
    });
    input.addEventListener('input', () => fitTextInInput(input));
  });
});



