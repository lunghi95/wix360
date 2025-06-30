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

// ——————————— Modal Exportar ———————————
function abrirExportModal() {
  document.getElementById("exportModal").style.display = "flex";
}
function cerrarExportModal() {
  document.getElementById("exportModal").style.display = "none";
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
      <td class="obs-cell">
  ${it.observaciones||''}
  <button class="edit-icon" onclick="editarObservacionesPrompt(${i})">
    <img src="Assets/edit-2.svg" alt=✏️/>
  </button>
</td>
<td>
  <button class="trash-icon" onclick="eliminarLinea(${i})">
    <img src="Assets/trash-duotone.svg" alt=❌/>
  </button>
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

// 1) Construye el Workbook idéntico al que descarga generateExcel()
function buildPedidoWorkbook() {
  const wb = XLSX.utils.book_new();

  // Hoja Detalle
  const sheet1 = [];
  sheet1.push(['Código', '', 'Cantidad', '', '', 'Observaciones']);
  pedidoActual.forEach(it => {
    sheet1.push([ it.codigo, '', it.cantidad, '', '', it.observaciones || '' ]);
  });
  const ws1 = XLSX.utils.aoa_to_sheet(sheet1);
  XLSX.utils.book_append_sheet(wb, ws1, 'Detalle');

  // Hoja Cliente
  const sheet2 = [];
  const c = clienteData;
  sheet2.push(['Nombre',            c.nombre    || '']);
  sheet2.push(['Teléfono',          c.telefono  || '']);
  sheet2.push(['Dirección',         c.direccion || '']);
  sheet2.push(['Localidad',         c.localidad || '']);
  sheet2.push(['Código Postal',     c.cp        || '']);
  sheet2.push(['Provincia',         c.provincia || '']);
  sheet2.push(['Email',             c.email     || '']);
  sheet2.push(['CUIT',              c.cuit      || '']);
  sheet2.push(['Cond. IVA',         c.condIVA   || '']);
  sheet2.push(['Expreso',           c.expreso   || '']);
  sheet2.push(['Condición de Venta',c.condVenta || '']);
  sheet2.push(['Vendedor',          c.vendedor  || '']);
  const genObs = document.getElementById('observacionesGenerales').value;
  sheet2.push(['Observaciones generales', genObs || '']);
  const ws2 = XLSX.utils.aoa_to_sheet(sheet2);
  XLSX.utils.book_append_sheet(wb, ws2, 'Cliente');

  return wb;
}

// 2) Convierte un Workbook a Base64 para enviar al Web App
function workbookToBase64(wb) {
  return new Promise(resolve => {
    const arrayBuffer = XLSX.write(wb, { bookType:'xlsx', type:'array' });
    const blob = new Blob([arrayBuffer], {
      type: 'application/octet-stream'
    });
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result = "data:…;base64,AAAA…"
      resolve(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
}

// --- NUEVO: genera PDF en memoria y lo pasa a Base64 --------------------
function pedidoPdfToBase64 () {
  return new Promise(resolve => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit:'mm', format:'a4' });
    drawPedidoEnPDF(pdf);                         // reutilizamos tu render
    // pasamos el arrayBuffer a base64
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(
      new Blob([pdf.output('arraybuffer')], { type:'application/pdf' })
    );
  });
}

// 3) Envía a Netlify Functions
async function sendPedidoToNetlify() {
  const wb = buildPedidoWorkbook();
  const attachmentBase64 = await workbookToBase64(wb);
  // asunto/nombre de archivo
  const hoy      = new Date();
  const dd       = String(hoy.getDate()).padStart(2,'0');
  const mm       = String(hoy.getMonth()+1).padStart(2,'0');
  const yyyy     = hoy.getFullYear();
  const safeName = clienteData.nombre.replace(/\s+/g,'_');
  const filename = `NP_${safeName}_${dd}-${mm}-${yyyy}.xlsx`;
  const subject  = `Pedido ${clienteData.nombre} ${dd}-${mm}-${yyyy}`;
  const customerEmail = (clienteData.email || '').trim();
  const pdfBase64 = await pedidoPdfToBase64();


  const payload = { subject, filename, attachmentBase64, pdfBase64, bodyPlain:'', bodyHtml:'', customerEmail: customerEmail || null };

  const resp = await fetch('/.netlify/functions/send-pedido-brevo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const result = await resp.json();
  if (!result.success) throw new Error(result.error || 'Error al enviar');
}

// 4) La nueva guardarPedidoFinal()
async function guardarPedidoFinal() {
  if (!pedidoActual.length) {
    alert("No hay artículos en el pedido.");
    return;
  }
  if (!confirm(
    "¿Estás seguro que deseas Guardar el pedido?\n\n" +
    "Se enviará automáticamente al mail de Pedidos."
  )) return;

  const btn = document.getElementById("btnGuardarPedido");
  btn.textContent = "Enviando…";
  btn.disabled   = true;

  try {
    await sendPedidoToNetlify();
    if (confirm("✅ Pedido enviado. ¿Querés ir al panel de exportar?")) {
      abrirExportModal();
    } else {
      // reset y volvemos a cliente
      pedidoActual = [];
      clienteData  = null;
      cerrarExportModal();
      abrirClienteModal();
      document.getElementById("btnAgregarArticulo").style.display = "none";
    }
  } catch (err) {
    console.error(err);
    if (confirm("❌ Falló el envío. ¿Querés ir al panel de exportar?")) {
      abrirExportModal();
    } else {
      pedidoActual = [];
      clienteData  = null;
      cerrarExportModal();
      abrirClienteModal();
      document.getElementById("btnAgregarArticulo").style.display = "none";
    }
  } finally {
    btn.textContent = "Guardar Pedido";
    btn.disabled   = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // ——— 1) Campos de cliente: fitTextInInput ———
  const campos = document.querySelectorAll('#clienteModal input, #clienteModal select');
  campos.forEach(input => {
    input.addEventListener('focus', () => {
      // al enfocar quitamos cualquier override inline
      input.style.fontSize = ''; // reset inline font-size
    });
    input.addEventListener('input', () => fitTextInInput(input));
  });

  // ——— 2) Detectar soporte de Web Share API para archivos ———
  const testFile = new File(
    [ new ArrayBuffer(1) ],
    "pedido.xlsx",
    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
  );
  const shareSupported = navigator.canShare && navigator.canShare({ files: [ testFile ] });

// ACA VA EL IF PARA VER SI SE MUESTRA EL BOTON DE COMPARTIR
  
  // ============== Botones de Exportar ==============
  document.getElementById("btnDownloadExcel").addEventListener("click", generateExcel);
  document.getElementById("btnCopyText"   ).addEventListener("click", copyTextPlain);
  document.getElementById("btnWhatsapp"   ).addEventListener("click", () => {
    // generamos el texto plano y lo abrimos en WhatsApp Web
    const texto = encodeURIComponent( generarTextoPlanoPedido() );
    const url   = `https://api.whatsapp.com/send?text=${texto}`;
    window.open(url, '_blank');
  });
  document.getElementById("btnMailTo"     ).addEventListener("click", mailPedido);

  // ============== Botones de Compartir ==============
  document.getElementById("btnShareExcel").addEventListener("click", sharePedidoCSV);
  document.getElementById('btnDownloadPDF').addEventListener('click', generatePedidoPDF);
  document.getElementById('btnSharePDF').addEventListener('click', sharePedidoPDF);


  // Nuevo pedido (siempre disponible)
  document.getElementById("btnNewPedido"  ).addEventListener("click", () => {
    // reiniciar todo
    pedidoActual = [];
    clienteData = null;
    cerrarExportModal();
    // volvemos al cliente
    abrirClienteModal();
    document.getElementById("btnAgregarArticulo").style.display = "none";
    document.getElementById("btnGuardarPedido").addEventListener("click", guardarPedidoFinal);
  });
});

/** Genera y descarga el Excel con dos hojas */
function generateExcel() {
  // 1) Nueva workbook
  const wb = XLSX.utils.book_new();

  // 2) Hoja “Detalle”: columnas A= Código, C= Cantidad, F= Observaciones
  const sheet1 = [];
  // opcional: encabezado
  sheet1.push(['Código', '', 'Cantidad', '', '', 'Observaciones']);
  pedidoActual.forEach(it => {
    sheet1.push([
      it.codigo,
      '',
      it.cantidad,
      '',
      '',
      it.observaciones || ''
    ]);
  });
  const ws1 = XLSX.utils.aoa_to_sheet(sheet1);
  XLSX.utils.book_append_sheet(wb, ws1, 'Detalle');

  // 3) Hoja “Cliente”: todos los datos + Observaciones generales
  const sheet2 = [];
  const c = clienteData;
  sheet2.push(['Nombre',            c.nombre        || '']);
  sheet2.push(['Teléfono',          c.telefono      || '']);
  sheet2.push(['Dirección',         c.direccion     || '']);
  sheet2.push(['Localidad',         c.localidad     || '']);
  sheet2.push(['Código Postal',     c.cp            || '']);
  sheet2.push(['Provincia',         c.provincia     || '']);
  sheet2.push(['Email',             c.email         || '']);
  sheet2.push(['CUIT',              c.cuit          || '']);
  sheet2.push(['Cond. IVA',         c.condIVA       || '']);
  sheet2.push(['Expreso',           c.expreso       || '']);
  sheet2.push(['Condición de Venta',c.condVenta     || '']);
  sheet2.push(['Vendedor',          c.vendedor      || '']);
  const genObs = document.getElementById('observacionesGenerales').value;
  sheet2.push(['Observaciones generales', genObs || '']);
  const ws2 = XLSX.utils.aoa_to_sheet(sheet2);
  XLSX.utils.book_append_sheet(wb, ws2, 'Cliente');

  // 4) Nombre de archivo
  const hoy = new Date();
  const dd = String(hoy.getDate()).padStart(2,'0');
  const mm = String(hoy.getMonth()+1).padStart(2,'0');
  const yyyy = hoy.getFullYear();
  const safeName = c.nombre.replace(/\s+/g,'_');
  const filename = `NP_${safeName}_${dd}-${mm}-${yyyy}.xlsx`;

  // 5) Descargar
  XLSX.writeFile(wb, filename);
}

/** Genera y devuelve el texto plano completo del pedido */
function generarTextoPlanoPedido() {
  const c = clienteData;
  let txt = `Datos del cliente:\n` +
            `Nombre: ${c.nombre}\n` +
            `Teléfono: ${c.telefono}\n` +
            `Dirección: ${c.direccion}\n` +
            `Localidad: ${c.localidad}\n` +
            `C.P.: ${c.cp}\n` +
            `Provincia: ${c.provincia}\n` +
            `Email: ${c.email}\n` +
            `CUIT: ${c.cuit}\n` +
            `Cond. IVA: ${c.condIVA}\n` +
            `Expreso: ${c.expreso}\n` +
            `Cond. Venta: ${c.condVenta}\n` +
            `Vendedor: ${c.vendedor}\n\n` +
            `Observaciones generales:\n${document.getElementById('observacionesGenerales').value}\n\n` +
            `Detalle del pedido:\nCódigo| |Cantidad| | |Observaciones\n`;
  pedidoActual.forEach(it => {
    txt += `${it.codigo}| |${it.cantidad}| | |${it.observaciones || ''}\n`;
  });
  return txt;
}

/** Copia texto plano al portapapeles */
function copyTextPlain() {
  const txt = generarTextoPlanoPedido();
  navigator.clipboard.writeText(txt).then(() => {
    alert('✅ Pedido copiado al portapapeles.');
  });
}

function generarTextoCliente () {
  const c = clienteData;
  return [
    `Cliente: ${c.nombre}`,
    `Teléfono: ${c.telefono}`,
    `Dirección: ${c.direccion}`,
    `Localidad: ${c.localidad}`,
    `CP: ${c.cp}`,
    `Provincia: ${c.provincia}`,
    `Email: ${c.email}`,
    `CUIT: ${c.cuit}`,
    `Cond. IVA: ${c.condIVA}`,
    `Expreso: ${c.expreso}`,
    `Cond. Venta: ${c.condVenta}`,
    `Vendedor: ${c.vendedor}`,
    `Obs. generales: ${document.getElementById('observacionesGenerales').value}`
  ].join('\n');
}

/*  Helper para texto csv seguro ------------- */
const csvEsc = str => (str || '')
  .replace(/"/g, '""');          // duplica comillas

/*  Compartir CSV con Detalle + Datos cliente */
async function sharePedidoCSV () {

  /* 1) ---------------- DETALLE ---------------- */
  const filas = [];
  filas.push(['Codigo', '', 'Cantidad', '', '', 'Observaciones']);  // encabezado

  pedidoActual.forEach(it => filas.push([
    it.codigo,
    '',                               // columna B vacía
    it.cantidad,
    '', '',                           // D y E vacías
    csvEsc(it.observaciones)
  ]));

  /* 2) ------ Separador + bloque Cliente ------ */
  filas.push([]);                     // línea en blanco
  filas.push(['DATOS DEL CLIENTE']);  // marcador visual

  const c = clienteData;
  const obsGen = document.getElementById('observacionesGenerales').value;

  [
    ['Nombre:',            c.nombre],
    ['Telefono:',          c.telefono],
    ['Direccion:',         c.direccion],
    ['Localidad:',         c.localidad],
    ['Codigo Postal:',     c.cp],
    ['Provincia:',         c.provincia],
    ['Email:',             c.email],
    ['CUIT:',              c.cuit],
    ['Cond. IVA:',         c.condIVA],
    ['Expreso:',           c.expreso],
    ['Condicion de Venta:',c.condVenta],
    ['Vendedor:',          c.vendedor],
    ['Observaciones generales:', obsGen]
  ].forEach(par => filas.push([par[0], csvEsc(par[1])]));

  /* 3) ---------- Convertir a CSV texto ---------- */
  const csvText = filas.map(r => r.join(',')).join('\r\n');
  const blob    = new Blob([csvText], { type: 'text/csv' });
  const nombre  = `NP_${c.nombre.replace(/\s+/g,'_')}.csv`;
  const file    = new File([blob], nombre, { type:'text/csv' });

  /* 4) ---------- Compartir o descargar ---------- */
  if (navigator.canShare && navigator.canShare({ files:[file] })) {
    try {
      await navigator.share({ files:[file] });
      console.info('✔️ CSV compartido');
      return;
    } catch(e) {
      console.warn('Compartir cancelado:', e);
    }
  }

  // fallback
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  a.click();
  alert('No se pudo compartir: se descargó el CSV para enviarlo manualmente.');
}


/** Abre el cliente de correo con subject+body (no adjunta) */
function mailPedido() {
  const c = clienteData;
  const subject = encodeURIComponent(`Nota de Pedido ${c.nombre}`);
  // reusar el texto plano
  let body = encodeURIComponent(
    `Datos del cliente:\nNombre: ${c.nombre}\nTeléfono: ${c.telefono}\n…\n\n` +
    `Detalle:\n` +
    pedidoActual.map(it => `${it.codigo} | | ${it.cantidad} | | | ${it.observaciones||''}`).join('\n')
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function pedidoTienePrecios () {
  return pedidoActual.some(it => it.precio && it.precio > 0);
}

function drawPedidoEnPDF(pdf) {
  /* --- 1) Cabecera del cliente ------------------- */
  const c = clienteData;
  const fecha = new Date().toLocaleDateString('es-AR');
  pdf.setFontSize(10);
  const pageW = pdf.internal.pageSize.getWidth();
  pdf.text(`Fecha: ${fecha}`, pageW - 10, 10, { align:'right' });

  // ── NUEVA cuadrícula de 6 filas / 3 columnas ──
  const y0 = 20, lh = 6; // y0 subir o bajar todo // lh altura de línea
  const L = 10, V1 = 30, L2 = 100, V2 = 120; // columnas anchos

  pdf.text('Cliente:',    L,  y0);          pdf.text(String(c.nombre),      V1, y0);
  pdf.text('CUIT:',       L2, y0);          pdf.text(String(c.cuit),        V2+5, y0);
  pdf.text('Dirección:',  L,  y0+lh);       pdf.text(String(c.direccion),   V1, y0+lh);
  pdf.text('Cond. IVA:',  L2, y0+lh);       pdf.text(String(c.condIVA),     V2+5, y0+lh);
  pdf.text('Localidad:',  L,  y0+lh*2);     pdf.text(String(c.localidad),   V1, y0+lh*2);
  pdf.text('Expreso:',    L2, y0+lh*2);     pdf.text(String(c.expreso),     V2+5, y0+lh*2);
  pdf.text('Provincia:',  L,  y0+lh*3);     pdf.text(String(c.provincia),   V1, y0+lh*3);
  pdf.text('CP:',         L2-35, y0+lh*3);  pdf.text(String(c.cp),          V2-44, y0+lh*3);
  pdf.text('Cond. Venta:',L2, y0+lh*3);     pdf.text(String(c.condVenta),   V2+5, y0+lh*3);
  pdf.text('Teléfono:',   L,  y0+lh*4);     pdf.text(String(c.telefono),    V1, y0+lh*4);
  pdf.text('Email:',      L2-35, y0+lh*4);  pdf.text(String(c.email),       V2-44, y0+lh*4);
  pdf.text('Vendedor:',   L2+55, y0+lh*4);  pdf.text(String(c.vendedor),    V2+55, y0+lh*4);

  const obs = document.getElementById('observacionesGenerales').value || '';
  pdf.text('Obs. generales:', L, y0+lh*5);
  pdf.text(obs, V1+10, y0+lh*5, { maxWidth: 160 });

  /* Línea divisoria */
  const startY = y0 + lh*6 + 4;
  pdf.line(10, startY, 200, startY);

  /* --- 2) Tabla de detalle ----------------------- */
  const conPrecio = pedidoTienePrecios();

  const head = conPrecio
    ? ['Código','Artículo','Color','Cant.','Observ.','Precio U.','Total $']
    : ['Código','Artículo','Color','Cant.','Observ.'];

  const body = pedidoActual.map(it => {
    const fila = [
      it.codigo,
      it.articulo || '',
      it.color    || '',
      it.cantidad,
      it.observaciones || ''
    ];
    if (conPrecio) {
    fila.push(
      it.precio?.toFixed(2) || '',
      (it.total||'').toString()
      );
    }
    return fila;
  });

  pdf.autoTable({
    head: [head],
    body,
    startY: startY + 6,
    styles: { fontSize:9, overflow:'linebreak' },
    headStyles: { fillColor:[180,180,180] }
  });

  /* --- 3) Totales en la última página ------------- */
  const totalPares   = pedidoActual.reduce((s,it)=>s+it.cantidad, 0);
  const totalImporte = pedidoActual.reduce((s,it)=>s+(it.total||0),0);

  const finalY = pdf.lastAutoTable.finalY + 6;
  pdf.setFontSize(11);
  pdf.text(`Total pares: ${totalPares}`, 20, finalY);
  if (conPrecio) {
    pdf.text(`Total $: ${totalImporte.toFixed(2)}`, 120, finalY);
  }

  /* --- 4) Descargar ------------------------------ */
  const nombre = `NP_${c.nombre.replace(/\s+/g,'_')}.pdf`;
}

function generatePedidoPDF () {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit:'mm', format:'a4' });

  drawPedidoEnPDF(pdf);            // pinta todo

  const nombre = `NP_${clienteData.nombre.replace(/\s+/g,'_')}.pdf`;
  pdf.save(nombre);                // descarga
}

async function sharePedidoPDF () {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit:'mm', format:'a4' });

  drawPedidoEnPDF(pdf);            // pinta lo mismo

  const blob   = new Blob([pdf.output('arraybuffer')], { type:'application/pdf' });
  const nombre = `NP_${clienteData.nombre.replace(/\s+/g,'_')}.pdf`;
  const file   = new File([blob], nombre, { type:'application/pdf' });

  if (navigator.canShare && navigator.canShare({ files:[file] })) {
    await navigator.share({ files:[file] });
  } else {
    pdf.save(nombre);              // fallback
    alert('El dispositivo no permite compartir PDF;\nse descargó para enviarlo manualmente.');
  }
}

/* Helper: genera el contenido en un objeto jsPDF ya existente */
function generatePedidoPDF_content(pdf){
  /* Copiá aquí todo lo que está dentro de generatePedidoPDF(),
     pero SIN la línea pdf.save() al final. */
}


