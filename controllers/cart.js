const {cartDao} = require ('../DAO/DaoGeneral.js')

const Carrito = require("../classes/cart.js");
const shopCart = new Carrito("./db/cart.txt");


async function listAll(req, res) {
 const resultado = await cartDao.listAll();
  return res.send(resultado);
};

async function listById(req, res) {
  const resultado = await cartDao.listById(req.params.id);
  return res.send(resultado);
}

async function createCart(req, res) {
  const resultado = await cartDao.createCart();
  return res.send(resultado);
}

async function addProduct(req, res) {
  const resultado = await cartDao.updateCart(req.params.id, req.body.cantidad);
  return res.send(resultado);
}

async function deleteCart(req, res) {
  const resultado = await cartDao.removeCart(req.params.id);
  return res.send(resultado);
}

async function removeProductById(req, res) {
  const resultado = await cartDao.removeProduct(req.params.id, req.params.id_prod);
  return res.send(resultado);
}

module.exports = { listAll, listById, createCart, addProduct, deleteCart, removeProductById }