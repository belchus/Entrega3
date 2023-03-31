const logger = require ('../utils/logger.js')
require("dotenv").config();
const {enviarMail} = require ('../utils/mail.js')
const {enviarSMS} = require ('../utils/sms.js')


const mongoUrl = process.env.MONGOURL;


const userHandler = require("../classes/userH.js");
const usr = new userHandler(mongoUrl);

async function main(req, res) {
  res.render("main", {titulo: "MOON ACCESORIOS", usuario: req.user.email, nombre: req.user.nombre, apellido: req.user.apellido, avatar: req.user.avatar, tipo: req.user.admin, id: req.user.id})
}

async function loginGet(req, res) {
  return res.render("login", {titulo: "MOON ACCESORIOS - Login" })
}

async function registerGet(req, res) {
  return res.render("register", {titulo: "MOON ACCESORIOS - Registro" })
}

async function registerPost(req, res, next) {
  const file = req.file;
  const nuevoUsuario = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    edad: parseInt(req.body.edad),
    direccion: req.body.direccion,
    telefono: req.body.telefono,
    email: req.body.email,
    password: req.body.password,
    avatar: `avatars/${file.filename}`,
    admin: req.body.admin,
  };
  usr.saveUser(nuevoUsuario);
  logger.info("Nuevo Usuario creado con exito");
}

async function notifyPurchase(data) {
  const destino = "cirrus.eagle@gmail.com"
  enviarMail(data.asunto, data.mensaje, destino)
  enviarSMS (data.mensajeSms)
}

async function notFound(req, res) {
  return res.status(404).send({ error: "Error 404, ruta no encontrada" });
}

module.exports = { main, loginGet, registerGet, registerPost, notFound, notifyPurchase};
