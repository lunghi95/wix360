// netlify/functions/send-pedido.js
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.handler = async function(event) {
  try {
    const data = JSON.parse(event.body)
    const plain = data.bodyPlain && data.bodyPlain.trim()
        ? data.bodyPlain
        : `Nuevo pedido de: ${data.subject}`;
    const html  = data.bodyHtml && data.bodyHtml.trim()
        ? data.bodyHtml
        : `<p>Adjunto el XLSX: <strong>${data.filename}</strong></p>`;
    const msg = {
      to:   process.env.PEDIDOS_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: data.subject,
      text:    plain,
      html:    html,
      attachments: [{
        content:     data.attachmentBase64,
        filename:    data.filename,
        type:        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: 'attachment'
      }]
    }
    await sgMail.send(msg)
    return { statusCode: 200, body: JSON.stringify({ success: true }) }
  } catch (err) {
    console.error("send-pedido error:", err)
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.toString() })
    }
  }
}

  
