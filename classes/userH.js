const mongoose = require("mongoose");
const userModel = require("../models/user.js");
const bcript = require("bcryptjs");
const {enviarMail} = require ('../utils/mail.js')
const logger = require ('../utils/logger.js')
const { connectDB } = require("../config.js");

module.exports = class UserHandler {
  constructor(url) {
    this.url = url;
  }

  connectDatabase() {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    try {
      mongoose.connect(this.url, connectionParams);
    } catch (error) {
      logger.error(error);
    }
  }

  async saveUser(data) {
    connectDB();
    const user = await this.findUserByMail(data.email);
    if (user) {
      return null;
    } else {
      var newUser = new userModel();
      newUser.id = await this.getHighestId();
      newUser.nombre = data.nombre;
      newUser.apellido = data.apellido;
      newUser.edad = data.edad;
      newUser.direccion = data.direccion;
      newUser.telefono = data.telefono;
      newUser.email = data.email;
      newUser.avatar = data.avatar;
      newUser.admin = data.admin;
      const encPass = await bcript.hash(data.password, 10);
      newUser.password = encPass;
      newUser.save((err) => {
        if (err) {
          logger.error(err);
        }
      });
      const message = {
        asunto: "Registro",
        destino: "araceli.kilback35@ethereal.email",
        mensaje: `Un nuevo usuario se ha registrado.
         nombre: ${data.nombre} ${data.apellido},
        edad: ${data.edad},
        dirección: ${data.direccion},
        celular: ${data.telefono},
        email: ${data.email}.`
      }
      enviarMail(message.asunto, message.mensaje, message.destino)
    }
  }

  async findUserByMail(email) {
    connectDB();
    const response = await userModel.findOne({ email: email });
    return response;
  }

  async findUserById(id) {
    connectDB();
    const response = await userModel.findOne({ id: id });
    return response;
  }

  async getHighestId() {
    connectDB();
    const data = await userModel.find({}, { id: 1, _id: 0 });
    if (data.length == 0) {
      return 1;
    } else {
      const highest = Math.max(...data.map((o) => o.id));
      const result = highest + 1;
      return result;
    }
  }
};
