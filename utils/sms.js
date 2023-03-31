require("dotenv").config();
const twilio = require("twilio");
const logger = require ('./logger.js')

const acctSid = process.env.TWILIO_ACCTSID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_SENDER_NUMBER;
const to = process.env.TWILIO_RECEIVER_NUMBER;

const twilioClient = twilio(acctSid, authToken);

async function enviarSMS(body) {
  try {
    await twilioClient.messages.create({ body, from, to });
  } catch (error) {
    logger.error(error);
  }
}

module.exports = { enviarSMS };