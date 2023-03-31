const fs = require("fs");
const main = require("../main.js");
const logger = require('../utils/logger.js')

module.exports = class Contenedor {
  constructor(archivo) {
    this.archivo = archivo;
  }

  async getAll() {
    await main.fileChecker(this.archivo);
    try {
      const file = await fs.promises.readFile(this.archivo, "utf-8");
      const data = JSON.parse(file);
      return data;
    } catch (error) {
      logger.error("error!: ", error);
    }
  }

  async getById(id) {
    await main.fileChecker(this.archivo);
    try {
      const file = await fs.promises.readFile(this.archivo, "utf-8");
      const data = JSON.parse(file);
      const index = data.findIndex((producto) => producto.id == id);
      return data[index] || { error: "producto no encontrado" };
    } catch (error) {
      logger.error("error!: ", error);
    }
  }

  async saveProduct(object) {
    await main.fileChecker(this.archivo);
    if ((await main.isAdmin(main.userLogged)) == true || await main.isAdmin(main.userLogged) == "true") {
      try {
        const file = await fs.promises.readFile(this.archivo, "utf-8");
        const data = JSON.parse(file);
        const ids = data.map((producto) => producto.id);
        const idMaximo = Math.max(...ids);
        if (!object.nombre) {
          return {
            error: "Se debe agregar un nombre",
          };
        } else if (!object.precio) {
          return { error: "Se debe agregar un precio" };
        } else if (!object.codigo) {
          return { error: "Se debe agregar un codigo" };
        } else if (!object.thumbnail) {
          return { error: "Se debe agregar un thumbnail" };
        } else if (!object.stock) {
          return { error: "Se debe agregar el stock" };
        } else if (!object.detalle) {
          return { error: "Se debe agregar descripcion" };
        } else if (idMaximo == -Infinity) {
          object.id = 1;
          object.timestamp = Date.now();
          data.push(object);
          await fs.promises.writeFile(
            this.archivo,
            JSON.stringify(data, null, 2)
          );
          return agregar;
        } else {
          const idMaximo = Math.max(...ids);
          object.id = idMaximo + 1;
          object.timestamp = Date.now();
          data.push(object);
          await fs.promises.writeFile(
            this.archivo,
            JSON.stringify(data, null, 2)
          );
          return object;
        }
      } catch (error) {
        logger.error("error!: ", error);
      }
    } else {
      return { error: -1, descripcion: "ruta / metodo POST no autorizado" };
    }
  }
  async updateProduct(object, id) {
    await main.fileChecker(this.archivo);
    if (await main.isAdmin(main.userLogged) == true || await main.isAdmin(main.userLogged) == "true" ) {
      try {
        const file = await fs.promises.readFile(this.archivo, "utf-8");
        const data = JSON.parse(file);
        const index = data.findIndex((producto) => producto.id == id);
        if (index == -1) {
          return { error: "producto no encontrado" };
        } else if (!object.nombre) {
          return { error: "Se debe agregar un nombre" };
        } else if (!object.precio) {
          return { error: "Se debe agregar  un precio" };
        } else if (!object.codigo) {
          return { error: "Se debe agregar un un codigo" };
        } else if (!object.thumbnail) {
          return { error: "Se debe agregar un thumbnail" };
        } else if (!object.stock) {
          return { error: "Se debe agregar el stock" };
        } else if (!object.detalle) {
          return { error: "Se debe agregar una descripcion" };
        } else {
          object.id = data[index].id;
          object.timestamp = data[index].timestamp;
          data.splice(index, 1, object);
          await fs.promises.writeFile(
            this.archivo,
            JSON.stringify(data, null, 2)
          );
        }
      } catch (error) {
        logger.error("error!: ", error);
      }
    } else {
      return { error: -1, descripcion: "ruta / metodo PUT no autorizado" };
    }
  }
  async deleteById(number) {
    await main.fileChecker(this.archivo);
    if ((await main.isAdmin(main.userLogged)) == true || await main.isAdmin(main.userLogged) == "true" ) {
      try {
        const file = await fs.promises.readFile(this.archivo, "utf-8");
        const data = JSON.parse(file);
        const index = data.findIndex((producto) => producto.id == number);
        if (index == -1) {
          return { error: "producto no encontrado" };
        } else {
          data.splice(index, 1);
          await fs.promises.writeFile(
            this.archivo,
            JSON.stringify(data, null, 2)
          );
        }
      } catch (error) {
        logger.error("error!: ", error);
      }
    } else {
      return { error: -1, descripcion: "ruta / metodo DELETE no autorizado" };
    }
  }
};
