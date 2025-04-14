// pedidoModule.js - Módulo de creación de pedidos dentro de visor360

let pedidoActual = [];
let clienteData = {};
let codigosInternos = {
  "JJ9825-5": {
    "BLACK": 22511,
    "WHITE": 22512,
    "BLACK TOTAL": 22531
  },
  "JJ28198-3": {
    "BLACK": 22503,
    "GOLD": 22504
  },
  "JJ28270-2A": {
    "BLACK": 22523,
    "GOLD": 22524
  },
  "JJ88718-13": {
    "BLACK": 22497,
    "YELLOW": 22498
  },
  "JJ88718-4": {
    "BLACK": 22492,
    "BEIGE": 22493,
    "BLACK TOTAL": 22530
  },
  "JJ88572-19": {
    "BLACK": 22507,
    "GOLD": 22508
  },
  "JJ9419-17": {
    "BLACK": 22510,
    "CAMEL": 22509
  },
  "JJ88718-14": {
    "BLACK": 22519,
    "WHITE": 22520,
    "BLACK TOTAL": 22529
  },
  "JJ88718-8": {
    "BLACK": 22496,
    "OFF WHITE": 22494
  },
  "JJ28270-6": {
    "BLACK": 22521,
    "CAMEL": 22522
  },
  "JJ9912-5": {
    "BLACK": 22518,
    "OFF WHITE": 22517
  },
  "JJ28279-1": {
    "BLACK": 22502,
    "OFF WHITE": 22501
  },
  "JJ88638-3": {
    "BLACK": 22514,
    "BEIGE": 22513
  },
  "JJ28198-1": {
    "GOLD": 22505,
    "BLACK": 22506
  },
  "JJ88572-18": {
    "BLACK": 22500,
    "BEIGE": 22499
  },
  "JJ88718-5": {
    "WHITE": 22516,
    "BLACK": 22515
  }
};

// Artículos con variantes especiales Black / Black Total
const variantesBlackTotal = {
  "JJ9825-5": ["BLACK", "BLACK TOTAL"],
  "JJ88718-14": ["BLACK", "BLACK TOTAL"],
  "JJ88718-4": ["BLACK", "BLACK TOTAL"]
};

// Función general para agregar producto al pedido
function agregarArticuloAlPedido(articulo, color) {
  const articuloKey = articulo.toUpperCase().trim();
  const colorKey = color.toUpperCase().trim();

  if (variantesBlackTotal[articuloKey] && colorKey === "BLACK") {
    const opciones = variantesBlackTotal[articuloKey];
    const seleccion = prompt(
      `¿Qué variante querés agregar de ${articuloKey}?\n` +
      opciones.map((v, i) => `${i + 1}. ${v}`).join('\n')
    );

    if (!seleccion || isNaN(seleccion) || seleccion < 1 || seleccion > opciones.length) {
      alert("Selección inválida.");
      return;
    }

    const varianteElegida = opciones[parseInt(seleccion) - 1];
    return agregarLinea(articuloKey, varianteElegida);
  }

  agregarLinea(articuloKey, colorKey);
}

// Función para agregar manualmente una línea al pedido
function agregarLinea(articulo, color, extraObs = '') {
  const articuloKey = articulo.toUpperCase().trim();
  const colorKey = color.toUpperCase().trim();
  const codigoInterno = codigosInternos[articuloKey]?.[colorKey];

  if (!codigoInterno) {
    alert(`❌ No se encontró el código interno para ${articuloKey} - ${colorKey}`);
    return;
  }

  const cantidad = prompt(`¿Cuántos pares de ${articuloKey} (${colorKey}) querés agregar?`);
  if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
    alert('❌ Cantidad inválida.');
    return;
  }

  const observaciones = prompt('¿Observaciones? (Talle, detalles, etc.)', extraObs);

  pedidoActual.push({
    codigo: codigoInterno,
    descripcion: '',
    cantidad: parseInt(cantidad),
    precio: '',
    bonificacion: '',
    observaciones: observaciones || '',
    articulo: articuloKey
  });

  alert('✅ Artículo agregado al pedido.');
}

// Agregar producto actual que se está viendo en visor360
function agregarProductoActual(index) {
  if (typeof productInfo === 'undefined' || !productInfo[index]) {
    alert("No se encontró información del producto actual.");
    return;
  }

  const articulo = productInfo[index].article;
  const color = productInfo[index].color;

  agregarArticuloAlPedido(articulo, color);
}

// Ver pedido actual en consola
function mostrarPedidoEnConsola() {
  console.log("📝 Pedido actual:", pedidoActual);
}
