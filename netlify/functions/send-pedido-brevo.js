// send-pedido-brevo.js
const Sib = require('sib-api-v3-sdk');
const client   = Sib.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
const api = new Sib.TransactionalEmailsApi();

exports.handler = async (event) => {
  try {
    const {
      subject, filename,
      attachmentBase64,   // XLSX (obligatorio)
      pdfBase64,          // PDF   (obligatorio desde ahora)
      bodyPlain = '',
      bodyHtml  = '',
      customerEmail       // opcional
    } = JSON.parse(event.body || '{}');

    // --- 1 · mail interno (Excel + PDF) -------------------
    await api.sendTransacEmail({
      sender:{ email:process.env.BREVO_SENDER_EMAIL, name:process.env.BREVO_SENDER_NAME },
      to:[{ email:process.env.BREVO_SENDER_EMAIL }],
      subject,
      textContent: bodyPlain,
      htmlContent: bodyHtml,
      attachment:[
        { content: attachmentBase64, name: filename },
        { content: pdfBase64,       name: filename.replace(/xlsx$/,'pdf') }
      ]
    });

    // --- 2 · mail al cliente (sólo PDF) -------------------
    if (customerEmail){
      await api.sendTransacEmail({
        sender:{ email:process.env.BREVO_SENDER_EMAIL, name:'Calzados Lunghi' },
        to:[{ email: customerEmail }],
        subject: 'Pedido Calzados Lunghi',
        textContent: `¡Muchas gracias por tu pedido!\nAdjuntamos el comprobante en PDF.`,
        htmlContent: `<p>¡Muchas gracias por tu pedido!</p><p>Adjuntamos el comprobante en PDF.</p>`,
        attachment:[
          { content: pdfBase64, name: filename.replace(/xlsx$/,'pdf') }
        ]
      });
    }

    return { statusCode:200, body:JSON.stringify({success:true}) };

  } catch(err){
    console.error(err);
    return { statusCode:500, body:JSON.stringify({success:false,error:String(err)}) };
  }
};
