
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
    abrirModalCabecera();
  };

  const btnAgregar = document.createElement("button");
  btnAgregar.id = "btnAgregarArticulo";
  btnAgregar.textContent = "+ Agregar Artículo";
  btnAgregar.style.padding = "8px 14px";
  btnAgregar.style.fontSize = "14px";
  btnAgregar.style.borderRadius = "5px";
  btnAgregar.style.border = "none";
  btnAgregar.style.cursor = "pointer";
  btnAgregar.style.backgroundColor = "#28a745";
  btnAgregar.style.color = "white";
  btnAgregar.style.display = "none";
  btnAgregar.onclick = () => {
    const index = getCurrentProductIndex();
    if (index) {
      console.log("🟢 Producto activo detectado:", index);
      agregarProductoActual(index);
    } else {
      alert("❌ No se detectó producto activo.");
    }
  };

  container.appendChild(btnPedido);
  container.appendChild(btnAgregar);

  const target = document.getElementById("spinnerContainer");
  if (target) {
    target.appendChild(container);
    console.log("✅ Botones insertados.");
  } else {
    console.warn("❌ No se encontró #spinnerContainer.");
  }
}

window.addEventListener("load", () => {
  inicializarBotonesPedido();
});
