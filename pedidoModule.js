
// pedidoModule.js - Módulo de creación de pedidos dentro de visor360

let pedidoActual = [];
let clienteData = {};
let codigosInternos = {};
let currentArticulo = null;
let currentColor = null;

// Artículos con variantes Black / Black Total
const variantesBlackTotal = {
  "JJ9825-5": ["BLACK", "BLACK TOTAL"],
  "JJ88718-14": ["BLACK", "BLACK TOTAL"],
  "JJ88718-4": ["BLACK", "BLACK TOTAL"]
};

// Cargar JSON de códigos internos
fetch('codigos_internos.json')
  .then(response => response.json())
  .then(data => {
    codigosInternos = data;
  });

// Función para agregar artículo actual al pedido
function agregarArticuloAlPedido(articulo, color) {
  const articuloKey = articulo.toUpperCase();
  const colorKey = color.toUpperCase();

  // Casos especiales con variantes
  if (variantesBlackTotal[articuloKey]) {
    const opciones = variantesBlackTotal[articuloKey];
    const seleccion = prompt(`¿Qué variante querés agregar de ${articuloKey}?
` +
                             opciones.map((v, i) => `${i + 1}. ${v}`).join('\n'));

    if (!seleccion || isNaN(seleccion) || seleccion < 1 || seleccion > opciones.length) {
      alert("Selección inválida.");
      return;
    }

    const varianteElegida = opciones[parseInt(seleccion) - 1];
    return agregarLinea(articuloKey, varianteElegida);
  }

  // Artículo normal
  agregarLinea(articuloKey, colorKey);
}

function agregarLinea(articulo, color, extraObs = '') {
  const codigoInterno = codigosInternos[articulo]?.[color];

  if (!codigoInterno) {
    alert(`No se encontró el código interno para ${articulo} - ${color}`);
    return;
  }

  const cantidad = prompt(`¿Cuántos pares de ${articulo} (${color}) querés agregar?`);
  if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
    alert('Cantidad inválida.');
    return;
  }

  const observaciones = prompt('¿Observaciones? (Talle, detalle, etc.)', extraObs);

  pedidoActual.push({
    codigo: codigoInterno,
    descripcion: '',
    cantidad: parseInt(cantidad),
    precio: '',
    bonificacion: '',
    observaciones: observaciones || '',
    articulo: articulo
  });

  alert('Artículo agregado al pedido.');
}

// Función auxiliar para ver el estado del pedido
function mostrarPedidoEnConsola() {
  console.log("Pedido actual:", pedidoActual);
}
