const mongoose = require('mongoose') ;

const carritoCollections = 'carrito'

const carritoSchema = new mongoose.Schema({
    id: {type: Number, requird: true, dropDups: true},
    timestamp: {type: Date, default: Date.now(), required: true},
    productos: {type: Array, required: true},
})

module.exports = mongoose.model(carritoCollections, carritoSchema)