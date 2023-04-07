const { chatDao } = require("../DAO/productos/DaoGeneral.js");

async function getAllChats() {
  const resultado = await chatDao.listAll();
  return resultado;
}

async function saveChat(object) {
  await chatDao.save(object);
}

module.exports = { getAllChats, saveChat };