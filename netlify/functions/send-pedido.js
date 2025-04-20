// netlify/functions/send-pedido.js
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.handler = async function(event) {
  try {
    const data = JSON.parse(event.body)
    const msg = {
      to:   process.env.PEDIDOS_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: data.subject,
      text:    data.bodyPlain  || '',
      html:    data.bodyHtml   || '',
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

  
