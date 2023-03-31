//variables de entorno
require("dotenv").config();

const { createTransport } = require ("nodemailer");
const logger = require ('./logger.js')

const GMAIL_MAIL = process.env.GMAIL_MAIL

async function enviarMail(asunto, mensaje, destino, adjunto) {
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: true,
        auth: {
            user: GMAIL_MAIL,
            pass: process.env.GMAIL_PASS
        }
    });


    const mailOptions = {
        from: GMAIL_MAIL,
        to: destino,
        subject: asunto,
        html: mensaje,
    }

    if(adjunto) {
        let adjuntoStream = fs.createReadStream(adjunto)
        mailOptions.attachments = [{
            path: adjuntoStream
        }]
    }

    try{
        const info = await transporter.sendMail(mailOptions)
        logger.info(`Enviado con exito. Id: ${info.messageId}`)
    } catch (error) {
        logger.error(error)
    }
}

module.exports = {enviarMail}