// netlify/functions/send-pedido.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async function(event) {
  try {
    // 1) Parsear el JSON que manda el front
    const data = JSON.parse(event.body);
    // 2) Montar el mensaje
    const msg = {
      to: process.env.PEDIDOS_EMAIL,       // tu cuenta receptora
      from: process.env.FROM_EMAIL,        // quien envía (debe ser verificado en SendGrid)
      subject: data.subject,
      text:    data.bodyPlain  || '',
      html:    data.bodyHtml   || '',
      attachments: [
        {
          content: data.attachmentBase64,
          filename: data.filename,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          disposition: 'attachment'
        }
      ]
    };
    // 3) Enviar
    await sgMail.send(msg);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error("send-pedido error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.toString() })
    };
  }
};
