const mongoose = require ('mongoose')

const userModel = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    edad: {
        type: Number,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    admin: {
        type: String,
        required: true,
    }
});

const UserModel = mongoose.model('usuarios', userModel)

module.exports = UserModel