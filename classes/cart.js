const { time } = require("console");
const fs = require("fs");
const main = require("../main.js");
const logger = require ('../utils/logger.js')

module.exports = class Carrito {
  constructor(archivo) {
    this.archivo = archivo;
  }
  async getAll() {
    await main.fileChecker(this.archivo);
    if(main.userLogged == 0){
      return {
        error:
          "no hay un usuario logueado.",
      };
    }else {
      try {
        const allCarts = await this.fileCatcher(this.archivo);
        return allCarts;
      } catch (error) {
        logger.error("error!: ", error);
      }
    }
  }

  async save() {
    await main.fileChecker(this.archivo);
    if ((await this.cartFinder(main.userLogged)) == -1) {
      this.newCart(main.userLogged, []);
      return { id: main.userLogged };
    } else {
      return { alerta: "el carrito " + main.userLogged + " ya existe" };
    }
  }

  async delete(id) {
    await main.fileChecker(this.archivo);
    if ((await this.cartFinder(id)) == -1) {
      return { error: "carrito no encontrado" };
    } else {
      try {
        await this.cartSplicer(id);
      } catch (error) {
        logger.error(error);
      }
    }
  }

  async getById(id) {
    await main.fileChecker(this.archivo);
    if ((await this.cartFinder(id)) == -1) {
      return { error: "carrito no encontrado" };
    } else {
      try {
        const productos = await this.cartViewer(id);
        return productos;
      } catch (error) {
        logger.error(error);
      }
    }
  }

  async addProduct(id, cant) {
    await main.fileChecker(this.archivo);
    const carts = await this.fileCatcher(this.archivo);
    const cart = carts[await this.cartFinder(main.userLogged)];
    const producto = await this.productFinder(id, "./db/product.txt");
    const productoAnadido = this.productBuilder(producto, cant);
    if(main.userLogged == 0){
      return {
        error:
          "no hay un usuario logueado.",
      };
    } else if (producto == false) {
      return {
        error:
          "el producto no existe",
      };
    } else if (cant == undefined) {
      return {
        alerta: "no se ha especificado ninguna cantidad de items a cargar",
      };
    } else if ((await this.cartFinder(main.userLogged)) == -1) {
      await this.newCart(main.userLogged, [productoAnadido]);
      return {
        alerta:
          "Creando carrito",
      };
    } else{
      const userProducts = await this.cartViewer(main.userLogged);
      const index = await userProducts.findIndex((producto) => producto.id == id);
      const userCart = {
        id: cart.id,
        timestamp: cart.timestamp,
        productos: userProducts,
      };
      if (index == -1) {
        userProducts.push(productoAnadido);
        carts.splice(await this.cartFinder(main.userLogged), 1, userCart);
        await fs.promises.writeFile(this.archivo, JSON.stringify(carts, null, 2));
        return null
      } else {
        userProducts.splice(index, 1, productoAnadido);
        carts.splice(await this.cartFinder(main.userLogged), 1, userCart);
        await fs.promises.writeFile(this.archivo, JSON.stringify(carts, null, 2));
        return null
      }
    }
  }

  async deleteProductById(idUser, idProd) {
    await main.fileChecker(this.archivo);
    if ((await this.cartFinder(idUser)) == -1) {
      return { error: "carrito no encontrado" };
    } else if ((await this.cartProductIndexer(idUser, idProd)) == -1) {
      return { error: "producto no encontrado" };
    } else {
      const carts = await this.fileCatcher(this.archivo);
      const cart = carts[await this.cartFinder(idUser)];
      const products = await this.cartViewer(idUser);
      const index = await this.cartProductIndexer(idUser, idProd);
      products.splice(index, 1);
      const userCart = {
        id: cart.id,
        timestamp: cart.timestamp,
        productos: products,
      };
      carts.splice(await this.cartFinder(idUser), 1, userCart);
      await fs.promises.writeFile(this.archivo, JSON.stringify(carts, null, 2));
    }
  }


  productBuilder(source, cant) {
    const producto = {
      id: source.id,
      timestamp: source.timestamp,
      nombre: source.nombre,
      detalle: source.detalle,
      codigo: source.codigo,
      thumbnail: source.thumbnail,
      precio: source.precio,
      stock: cant,
    };
    return producto;
  }

  async newCart(id, products) {
    const file = await this.fileCatcher(this.archivo);
    const cart = { id: id, timestamp: Date.now(), productos: products };
    file.push(cart);
    await fs.promises.writeFile(this.archivo, JSON.stringify(file, null, 2));
  }

  async cartFinder(id) {
    const file = await this.fileCatcher(this.archivo);
    const index = file.findIndex((cart) => cart.id == id);
    return index;
  }

  async cartProductIndexer(idUser, idProduct) {
    const products = await this.cartViewer(idUser);
    const index = products.findIndex((producto) => producto.id == idProduct);
    return index;
  }

  async cartViewer(id) {
    const file = await this.fileCatcher(this.archivo);
    return file[await this.cartFinder(id)].productos;
  }

  async productFinder(id, source) {
    try {
      const file = await this.fileCatcher(source);
      const index = file.findIndex((producto) => producto.id == id);
      return file[index] || false;
    } catch (error) {
      logger.error(error);
    }
  }

  async cartSplicer(id) {
    const file = await this.fileCatcher(this.archivo);
    file.splice(await this.cartFinder(id), 1);
    await fs.promises.writeFile(this.archivo, JSON.stringify(file, null, 2));
  }

  async fileCatcher(source) {
    const file = await fs.promises.readFile(source, "utf-8");
    const data = JSON.parse(file);
    return data;
  }
};
