const logger = require("../logger.js");
const { getAllChats, saveChat } = require("../controllers/chats.js");
const { listAll, createProduct} = require("../controllers/productos.js");
const {getInfo} = require ("../utils/info.js")


module.exports = (io) => {
  io.on("connection", async (socket) => {
    logger.info("Cliente en linea");
    socket.emit("mensajes", await getAllChats());
    socket.emit("mensaje", await getAllChats());
    socket.emit("productos", await listAll());
    socket.emit("producto", await listAll());
    socket.emit("info", getInfo());
    socket.on("new-message", async (data) => {
      await saveChat(data);
      io.sockets.emit("mensaje", await getAllChats());
    });
    socket.on("new-producto", async (data) => {
      await createProduct(data);
      io.sockets.emit("producto", await listAll());
    });
  });
};