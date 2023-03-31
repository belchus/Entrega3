const mongoose = require('mongoose') ;

const productosCollections = 'productos'

const ProductoSchema = new mongoose.Schema({
    nombre: {type: String, required: true, max: 50},
    precio: {type: Number, required: [true, "un valor debe ser incluido"]},
    codigo: {type: String, required: true, max: 10},
    thumbnail: {type: String, required: true},
    stock:{type: Number, required: true},
    detalle: {type: String, required: true},
    id: {type: Number, requird: true, dropDups: true},
    timestamp: {type: Date, default: Date.now(), required: true},
})

module.exports = mongoose.model(productosCollections, ProductoSchema)