// pedidoModule.js
// Usa window.linea, window.catalogos, window.getProducto y window.getCodigo

let pedidoActual = [];
let clienteData = null;

/**
 * Agrega directamente una línea al pedido (cantidad y observaciones),
 * asumiendo que el color ya viene final (sin volver a preguntar variante).
 */
function agregarLinea(articulo, color, extraObs = '') {
  const artKey = articulo.toUpperCase().trim();
  const colKey = color.trim();  // NO volvemos a preguntar variante aquí

  // Obtener código interno desde catalogo.js
  const codigo = getCodigo(window.linea, artKey, colKey);
  if (!codigo) {
    return alert(`❌ No se encontró el código interno para ${artKey} - ${colKey}`);
  }

  // Pedir cantidad
  const cantidad = prompt(`¿Cuántos pares de ${artKey} (${colKey}) querés agregar?`);
  if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
    return alert('❌ Cantidad inválida.');
  }

  // Pedir observaciones
  const observaciones = prompt('¿Observaciones? (Talle, detalles, etc.)', extraObs);

  // Agregar al array del pedido
  pedidoActual.push({
    linea: window.linea,
    articulo: artKey,
    color: colKey,
    codigo,
    cantidad: parseInt(cantidad, 10),
    observaciones: observaciones || ''
  });
  alert('✅ Artículo agregado al pedido.');
}

/**
 * Primer nivel de agregado: aquí preguntamos por variante Black/Black Total
 * **solo** si corresponde**, luego llamamos a agregarLinea.
 */
function agregarArticuloAlPedido(articulo, color) {
  const artKey = articulo.toUpperCase().trim();
  let colKey = color.trim();

  // 1) Tomo el map de variantesPORcolor para este artículo (puede no existir)
  const variantesMap = window.catalogos[window.linea]
    ?.variantesPorColor?.[artKey] || {};

  // 2) Sólo pregunto si hay variantes definidas PARA ESTE color base
  const opcionesVar = variantesMap[colKey] || [];
  if (opcionesVar.length > 0) {
    // construyo lista de opciones: primero el color base, luego sus variantes
    const lista = [colKey, ...opcionesVar];
    const texto = lista.map((v,i) => `${i+1}. ${v}`).join('\n');
    const sel = prompt(`¿Qué variante querés agregar de ${artKey}?\n${texto}`);
    if (!sel || isNaN(sel) || sel<1 || sel>lista.length) {
      return alert('Selección inválida.');
    }
    // actualizo colKey con la variante elegida
    colKey = lista[parseInt(sel,10)-1];
  }

  // Verificar si ya existe en el pedido
  const idx = pedidoActual.findIndex(
    it => it.articulo === artKey && it.color === colKey
  );
  if (idx >= 0) {
    const existente = pedidoActual[idx].cantidad;
    if (confirm(
      `El artículo ${artKey} ${colKey} ya tiene ${existente} pares.\n` +
      `¿Querés sumar más pares?`
    )) {
      return window.actualizarCantidadPrompt(idx);
    }
    return;
  }

  // Si no existía, lo agregamos (sin volver a preguntar variante)
  agregarLinea(artKey, colKey);
}

/**
 * Agrega el artículo actualmente seleccionado en el visor 360°.
 */
function agregarLineaDesdeVisor() {
  const idx = getCurrentProductIndex();
  if (!idx) return alert('No se encontró producto activo.');
  const info = getProducto(window.linea, idx);
  if (!info) return alert('No se encontró información del producto actual.');
  agregarArticuloAlPedido(info.article, info.color);
}

/**
 * Devuelve el ID padded ('01', '02', ...) del producto seleccionado en el carrusel.
 */
function getCurrentProductIndex() {
  const sel = document.querySelector('.miniature.selected');
  if (!sel) return null;
  const num = sel.getAttribute('data-product');
  return num ? num.toString().padStart(2, '0') : null;
}

/**
 * Debug: muestra el pedido en consola.
 */
function mostrarPedidoEnConsola() {
  console.log('📝 Pedido actual:', pedidoActual);
}
