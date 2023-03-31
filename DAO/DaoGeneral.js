const ProductosMongo = require ('./products/ProductosDaoMongoDb.js');
const CarritosMongo = require ('./carts/CarritosDaoMongoDb.js');
const ProductosFirebase = require ('./products/ProductosDaoFirebase.js');
const CarritosFirebase = require ('./carts/CarritosDaoFirebase.js');
const ProductosFileSystem = require ('./products/ProductosDaoFileSystem.js')
const CarritosFileSystem = require ('./carts/CarritosDaoFileSystem.js')

const {persistenceType} = require('../config.js')

let productDao = null;
let cartDao = null;

if (persistenceType === "filesystem") {
  productDao = new ProductosFileSystem();
  cartDao = new CarritosFileSystem();
}

if (persistenceType === "mongo") {
  productDao = new ProductosMongo();
  cartDao = new CarritosMongo();
}

if (persistenceType === "firebase") {
  productDao = new ProductosFirebase();
  cartDao = new CarritosFirebase();
}

module.exports = { productDao, cartDao }