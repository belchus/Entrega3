const fs = require("fs");
const logger = require('./utils/logger.js')

async function isAdmin(id) {
  if(id == 0) {
    return false
  } else {
    try {
      const file = await fs.promises.readFile("./db/users.txt", "utf-8");
      const data = JSON.parse(file);
      const index = data.findIndex((usuario) => usuario.id == id);
      return data[index].admin;
    } catch (error) {
      logger.error("error!: ", error);
    }
  }
}

async function fileChecker(file) {
  if (!fs.existsSync(file)) {
    try {
      await fs.promises.writeFile(file, "[]");
    } catch (error) {
      logger.error("error!: ", error);
    }
  }
}
var userLogged = 0;

module.exports = { isAdmin, fileChecker, userLogged };