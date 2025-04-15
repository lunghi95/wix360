
let cabeceraCargada = false;

function abrirModalCabecera() {
  document.getElementById("pedidoModal").style.display = "flex";

  mostrarSolapa('cabecera');

  if (!cabeceraCargada) {
    document.getElementById("tabs-nav").style.display = "none";
    const btn = document.getElementById("btnGuardarPedido");
    btn.textContent = "Guardar";
    btn.classList.remove("guardar-verde");
  }
}

function mostrarSolapa(nombre) {
  document.getElementById("tab-cabecera").style.display = nombre === "cabecera" ? "grid" : "none";
  document.getElementById("tab-detalle").style.display = nombre === "detalle" ? "block" : "none";

  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelector(`.tab[onclick*='${nombre}']`).classList.add("active");
}

function formatearCUIT(input) {
  let v = input.value.replace(/[^0-9]/g, '').slice(0, 11);
  if (v.length >= 2) v = v.slice(0,2) + '-' + v.slice(2);
  if (v.length >= 11) v = v.slice(0,11) + '-' + v.slice(11);
  input.value = v.slice(0,13);
  document.getElementById("label-cond-iva").style.display = v.length === 13 ? 'block' : 'none';
}

function guardarCabecera() {
  const nombre = document.getElementById("pedido-nombre").value.trim();
  if (!nombre) return alert("Completá al menos el nombre del cliente.");

  cabeceraCargada = true;
  mostrarTabsYBoton();
  alert("✅ Cabecera cargada correctamente. Ahora podés agregar artículos.");
}

function guardarPedidoFinal() {
  if (!cabeceraCargada) {
    guardarCabecera();
    return;
  }

  if (pedidoActual.length === 0) {
    alert("Cargaste los datos del cliente pero aún no agregaste ningún artículo.");
    return;
  }

  alert("Aquí se exportaría o compartiría el pedido. Próxima etapa 📝");
}

function mostrarTabsYBoton() {
  document.getElementById("tabs-nav").style.display = "flex";
  const btnGuardar = document.getElementById("btnGuardarPedido");
  btnGuardar.textContent = "Guardar Pedido";
  btnGuardar.classList.add("guardar-verde");
}

window.abrirModalCabecera = abrirModalCabecera;
