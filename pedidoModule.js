// pedidoModule.js
// Módulo de datos y lógica de pedidos

let pedidoActual = [];
let clienteData = null;

// Códigos internos por artículo y color
const codigosInternos = {
  "JJ9825-5": { "Black": 22511, "White": 22512, "Black Total": 22531 },
  "JJ28198-3": { "Black": 22503, "Gold": 22504 },
  "JJ28270-2A": { "Black": 22523, "Gold": 22524 },
  "JJ88718-13": { "Black": 22497, "Yellow": 22498 },
  "JJ88718-4": { "Black": 22492, "Beige": 22493, "Black Total": 22530 },
  "JJ88572-19": { "Black": 22507, "Gold": 22508 },
  "JJ9419-17": { "Black": 22510, "Camel": 22509 },
  "JJ88718-14": { "Black": 22519, "White": 22520, "Black Total": 22529 },
  "JJ88718-8": { "Black": 22496, "Off White": 22494 },
  "JJ28270-6": { "Black": 22521, "Camel": 22522 },
  "JJ9912-5": { "Black": 22518, "Off White": 22517 },
  "JJ28279-1": { "Black": 22502, "Off White": 22501 },
  "JJ88638-3": { "Black": 22514, "Beige": 22513 },
  "JJ28198-1": { "Gold": 22505, "Black": 22506 },
  "JJ88572-18": { "Black": 22500, "Beige": 22499 },
  "JJ88718-5": { "White": 22516, "Black": 22515 }
};

// Artículos con variantes especial Black / Black Total
const variantesBlackTotal = {
  "JJ9825-5": ["Black", "Black Total"],
  "JJ88718-14": ["Black", "Black Total"],
  "JJ88718-4": ["Black", "Black Total"]
};

/**
 * Agrega un artículo al pedido, primero resolviendo variantes especiales,
 * luego comprobando duplicados sobre la variante elegida,
 * y al final insertando o editando la línea.
 */
function agregarArticuloAlPedido(articulo, color) {
  const artKey = articulo.toUpperCase().trim();
  let   colKey = color.trim();  // dejamos la capitalización tal cual viene del map

  // — 1) Variante especial Black / Black Total —
  if (variantesBlackTotal[artKey] && color.trim().toLowerCase() === "black") {
    const opciones  = variantesBlackTotal[artKey];
    const textoOpts = opciones.map((v,i) => `${i+1}. ${v}`).join("\n");
    const sel       = prompt(`¿Qué variante querés agregar de ${artKey}?\n${textoOpts}`);
    if (!sel || isNaN(sel) || sel < 1 || sel > opciones.length) {
      return alert("Selección inválida.");
    }
    colKey = opciones[parseInt(sel,10)-1];  // ¡ojo! esa variante ya viene “Capitalizada”
  }

  // — 2) Duplicados sobre la variante final —
  const idx = pedidoActual.findIndex(
    it => it.articulo === artKey && it.color === colKey
  );
  if (idx >= 0) {
    const existente = pedidoActual[idx].cantidad;
    if (confirm(
      `El artículo ${artKey} ${colKey} ya tiene ${existente} pares.\n` +
      `¿Querés sumar más pares?`
    )) {
      // reutiliza tu prompt de cantidad
      return window.actualizarCantidadPrompt(idx);
    }
    return; // si cancela, no hace nada
  }

  // — 3) Nueva línea con la variante final —
  agregarLinea(artKey, colKey);
}

/**
 * Agrega una línea al pedido pidiendo cantidad y observaciones
 */
function agregarLinea(articulo, color, extraObs = '') {
  const artKey = articulo.toUpperCase().trim();
  const colKey = color.trim();   // mantenemos la forma “Black”, “Beige”…
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
