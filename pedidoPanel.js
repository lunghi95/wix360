const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz2c2kkthOyuwI_4LOAJ-I-ZkfOaOzXsMUJ98uQZTvDiXfEbjTlAg30SnIqrx6wHHNe/exec';

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

function guardarPedidoFinal() {
  if (pedidoActual.length === 0) {
    alert("No hay artículos en el pedido.");
    return;
  }
  // Cerrar el detalle y abrir exportación
  cerrarDetalleModal();
  abrirExportModal();
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

// 3) Envía al Web App con fetch()
async function sendPedidoToWebApp() {
  const wb = buildPedidoWorkbook();
  const attachmentBase64 = await workbookToBase64(wb);

  // Armar asunto/nombre de archivo
  const hoy      = new Date();
  const dd       = String(hoy.getDate()).padStart(2,'0');
  const mm       = String(hoy.getMonth()+1).padStart(2,'0');
  const yyyy     = hoy.getFullYear();
  const safeName = clienteData.nombre.replace(/\s+/g,'_');
  const filename = `NP_${safeName}_${dd}-${mm}-${yyyy}.xlsx`;
  const subject  = `NP ${clienteData.nombre} ${dd}-${mm}-${yyyy}`;

  const payload = {
    subject,
    filename,
    attachmentBase64,
    bodyPlain:  '',  // si quieres texto extra
    bodyHtml:   ''   // o HTML en caso
  };

  // 3.5) Llama al Web App
  const resp = await fetch(WEB_APP_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload)
  });
  const result = await resp.json();
  if (!result.success) {
    throw new Error(result.error || 'Error al enviar el pedido');
  }
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
    await sendPedidoToWebApp();
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
  const campos = document.querySelectorAll('#clienteModal input, #clienteModal select');
  campos.forEach(input => {
    input.addEventListener('focus', () => {
      // al enfocar quitamos cualquier override inline
      input.style.fontSize = '';
    });
    input.addEventListener('input', () => fitTextInInput(input));
  });
  // ============== Botones de Exportar ==============
  document.getElementById("btnDownloadExcel").addEventListener("click", generateExcel);
  document.getElementById("btnCopyText"   ).addEventListener("click", copyTextPlain);
  document.getElementById("btnWhatsapp"   ).addEventListener("click", () => {
    const texto = encodeURIComponent( generarTextoPlanoPedido() );
    const url   = `https://api.whatsapp.com/send?text=${texto}`;
    window.open(url, '_blank');
  });
  document.getElementById("btnMailTo"     ).addEventListener("click", mailPedido);
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

/** Usa la Web Share API para compartir XLSX (si está disponible) */
async function sharePedido() {
  if (!navigator.canShare || !navigator.canShare({ files: [] })) {
    return alert('Compartir no está soportado en este navegador.');
  }
  // recrear workbook como en generateExcel(), pero en ArrayBuffer
  const wb = XLSX.utils.book_new();
  // … copiar aquí la construcción de ws1 y ws2 … (idem generateExcel)
  // para no repetir: podemos llamar a generateExcel y capturar el buffer, 
  // pero por claridad reescribimos:
  const sheet1 = [['Código','','Cantidad','','','Observaciones']];
  pedidoActual.forEach(it => sheet1.push([it.codigo,'',it.cantidad,'','',it.observaciones||'']));
  const ws1 = XLSX.utils.aoa_to_sheet(sheet1);
  XLSX.utils.book_append_sheet(wb, ws1, 'Detalle');

  const sheet2 = [];
  const c = clienteData;
  sheet2.push(['Nombre',c.nombre||'']);
  sheet2.push(['Teléfono',c.telefono||'']);
  // … resto campos …
  const genObs = document.getElementById('observacionesGenerales').value;
  sheet2.push(['Observaciones generales', genObs||'']);
  const ws2 = XLSX.utils.aoa_to_sheet(sheet2);
  XLSX.utils.book_append_sheet(wb, ws2, 'Cliente');

  // buffer
  const wbout = XLSX.write(wb, { bookType:'xlsx', type:'array' });
  const blob  = new Blob([wbout], { type: 'application/octet-stream' });
  const fileName = `NP_${c.nombre.replace(/\s+/g,'_')}.xlsx`;
  const file = new File([blob], fileName, { type: blob.type });

  try {
    await navigator.share({
      title: `Pedido ${c.nombre}`,
      files: [file],
      text: 'Aquí tenés el pedido.'
    });
  } catch (err) {
    console.error(err);
  }
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



