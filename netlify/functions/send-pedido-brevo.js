// --- Dependencias y auth ----------------------------------------------------
const Sib     = require('sib-api-v3-sdk');
const client  = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

// Aliases cómodos
const sendEmail = new Sib.TransactionalEmailsApi();
const FROM_EMAIL = process.env.BREVO_SENDER_EMAIL;   //  «pedidos@calzadoslunghi.com.ar»
const FROM_NAME  = process.env.BREVO_SENDER_NAME;    //  «Calzados Lunghi Pedidos»
const OWNER_MAIL = process.env.PEDIDOS_EMAIL;        //  «info@calzadoslunghi.com.ar»

// ---------------------------------------------------------------------------
// handler
// ---------------------------------------------------------------------------
exports.handler = async (event) => {
  try {
    const {
      subject,               // ej.  NP Cliente 30-06-2025
      filename,              // ej.  NP_Cliente_30-06-2025.xlsx
      attachmentBase64,      // XLSX   (obligatorio)
      pdfBase64,             // PDF    (obligatorio)
      customerEmail          // puede venir undefined / null
    } = JSON.parse(event.body || '{}');

    // ============ 1 · MAIL INTERNO (a ti)  ==============================
    await sendEmail.sendTransacEmail({
      sender : { email: FROM_EMAIL, name: FROM_NAME },
      to     : [{ email: OWNER_MAIL }],
      subject,
      textContent : 'Adjuntamos pedido (Excel + PDF).',
      htmlContent : '<p>Adjuntamos pedido (<b>Excel</b> + <b>PDF</b>).</p>',
      headers     : { 'Reply-To': OWNER_MAIL },          // ← si respondes, te lo reenvía a ti mismo
      attachment  : [
        { content: attachmentBase64, name: filename },
        { content: pdfBase64,        name: filename.replace(/\.xlsx$/i, '.pdf') }
      ]
    });

    // ============ 2 · MAIL AL CLIENTE (sólo PDF) =======================
    if (customerEmail) {
      await sendEmail.sendTransacEmail({
        sender : { email: FROM_EMAIL, name: 'Calzados Lunghi' },
        to     : [{ email: customerEmail }],
        subject: 'Detalle de tu pedido – Calzados Lunghi',
        textContent : [
          '¡Muchas gracias por tu pedido!',
          'Adjuntamos el comprobante en PDF.',
          'NO respondas a este correo; ante cualquier duda escribinos a info@calzadoslunghi.com.ar'
        ].join('\n'),
        htmlContent : `
          <p>¡Muchas gracias por tu pedido!</p>
          <p>Adjuntamos el comprobante en PDF.</p>
          <p style="font-size:0.9em;color:#666">
            <b>No respondas a este correo</b>; ante cualquier duda escribinos a
            <a href="mailto:info@calzadoslunghi.com.ar">info@calzadoslunghi.com.ar</a>.
          </p>
        `,
        headers     : { 'Reply-To': OWNER_MAIL },        // ← si el cliente responde, llega a info@
        attachment  : [
          { content: pdfBase64, name: filename.replace(/\.xlsx$/i, '.pdf') }
        ]
      });
    }

    // OK
    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: String(err) }) };
  }
};
