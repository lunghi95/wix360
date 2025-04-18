function inicializarBotonesPedido() {
  const container = document.createElement("div");
  container.id = "pedido-buttons";
  container.style.cssText = 'position:absolute;top:20px;left:20px;z-index:20;display:flex;flex-direction:column;gap:10px';

  const btnPedido = document.createElement("button");
  btnPedido.textContent = "📝 Pedido";
  btnPedido.style.cssText = 'padding:8px 14px;font-size:14px;border-radius:5px;border:none;cursor:pointer;background:#007bff;color:#fff';
  btnPedido.onclick = () => {
    if (!clienteData) {
      abrirClienteModal();
    } else {
      abrirDetalleModal();
    }
  };

  const btnAgregar = document.createElement("button");
  btnAgregar.id = "btnAgregarArticulo";
  btnAgregar.textContent = "➕ Agregar Artículo";
  btnAgregar.style.cssText = 'padding:8px 14px;font-size:14px;border-radius:5px;border:none;cursor:pointer;background:#28a745;color:#fff;display:none';
  btnAgregar.onclick = () => {
    const idx = getCurrentProductIndex();
    if (idx) agregarLineaDesdeVisor(idx);
    else alert("❌ No hay producto activo.");
  };

  container.append(btnPedido, btnAgregar);
  const target = document.getElementById("spinnerContainer");
  if (target) target.appendChild(container);
}

window.addEventListener("load", inicializarBotonesPedido);
