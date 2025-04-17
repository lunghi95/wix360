// pedidoModule.js
// Módulo de datos y lógica de pedidos

let pedidoActual = [];
let clienteData = null;

// Códigos internos por artículo y color
const codigosInternos = {
  "JJ9825-5": { "BLACK": 22511, "WHITE": 22512, "BLACK TOTAL": 22531 },
  "JJ28198-3": { "BLACK": 22503, "GOLD": 22504 },
  "JJ28270-2A": { "BLACK": 22523, "GOLD": 22524 },
  "JJ88718-13": { "BLACK": 22497, "YELLOW": 22498 },
  "JJ88718-4": { "BLACK": 22492, "BEIGE": 22493, "BLACK TOTAL": 22530 },
  "JJ88572-19": { "BLACK": 22507, "GOLD": 22508 },
  "JJ9419-17": { "BLACK": 22510, "CAMEL": 22509 },
  "JJ88718-14": { "BLACK": 22519, "WHITE": 22520, "BLACK TOTAL": 22529 },
  "JJ88718-8": { "BLACK": 22496, "OFF WHITE": 22494 },
  "JJ28270-6": { "BLACK": 22521, "CAMEL": 22522 },
  "JJ9912-5": { "BLACK": 22518, "OFF WHITE": 22517 },
  "JJ28279-1": { "BLACK": 22502, "OFF WHITE": 22501 },
  "JJ88638-3": { "BLACK": 22514, "BEIGE": 22513 },
  "JJ28198-1": { "GOLD": 22505, "BLACK": 22506 },
  "JJ88572-18": { "BLACK": 22500, "BEIGE": 22499 },
  "JJ88718-5": { "WHITE": 22516, "BLACK": 22515 }
};

// Artículos con variantes especial Black / Black Total
const variantesBlackTotal = {
  "JJ9825-5": ["BLACK", "BLACK TOTAL"],
  "JJ88718-14": ["BLACK", "BLACK TOTAL"],
  "JJ88718-4": ["BLACK", "BLACK TOTAL"]
};

/**
 * Agrega un artículo al pedido, gestionando variantes Black/Black Total
 */
function agregarArticuloAlPedido(articulo, color) {
  const artKey = articulo.toUpperCase().trim();
  const colKey = color.toUpperCase().trim();

  // Si hay variante especial y se seleccionó "BLACK"
  if (variantesBlackTotal[artKey] && colKey === "BLACK") {
    const opciones = variantesBlackTotal[artKey];
    const seleccion = prompt(
      `¿Qué variante querés agregar de ${artKey}?\n` +
        opciones.map((v, i) => `${i + 1}. ${v}`).join('\n')
    );
    if (!seleccion || isNaN(seleccion) || seleccion < 1 || seleccion > opciones.length) {
      alert("Selección inválida.");
      return;
    }
    const variante = opciones[parseInt(seleccion) - 1];
    return agregarLinea(artKey, variante);
  }
  // Variante normal
  agregarLinea(artKey, colKey);
}

/**
 * Agrega una línea al pedido pidiendo cantidad y observaciones
 */
function agregarLinea(articulo, color, extraObs = '') {
  const artKey = articulo.toUpperCase().trim();
  const colKey = color.toUpperCase().trim();
  const codigo = codigosInternos[artKey]?.[colKey];
  if (!codigo) {
    alert(`❌ No se encontró el código interno para ${artKey} - ${colKey}`);
    return;
  }
  const cantidad = prompt(`¿Cuántos pares de ${artKey} (${colKey}) querés agregar?`);
  if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
    alert('❌ Cantidad inválida.');
    return;
  }
  const observaciones = prompt('¿Observaciones? (Talle, detalles, etc.)', extraObs);

  pedidoActual.push({
    articulo: artKey,
    color: colKey,
    codigo: codigo,
    cantidad: parseInt(cantidad),
    observaciones: observaciones || ''
  });
  alert('✅ Artículo agregado al pedido.');
}

/**
 * Obtiene índice de producto activo en carrusel
 */
function getCurrentProductIndex() {
  const sel = document.querySelector('.miniature.selected');
  if (!sel) return null;
  const num = sel.dataset.product || sel.getAttribute('data-product');
  return num ? num.toString().padStart(2, '0') : null;
}

/**
 * Agrega al pedido el producto actual del visor
 */
function agregarLineaDesdeVisor(idx) {
  const info = productInfo[idx];
  if (!info) return alert('No se encontró información del producto actual.');
  agregarArticuloAlPedido(info.article, info.color);
}

/**
 * Muestra el pedido en consola (debug)
 */
function mostrarPedidoEnConsola() {
  console.log('📝 Pedido actual:', pedidoActual);
}
