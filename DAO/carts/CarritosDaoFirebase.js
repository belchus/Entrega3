const contenedorFirebase = require('../../classes/firebase.js')

module.exports = class CarritosDaoFirebase extends contenedorFirebase {
    constructor(){
        super("carritos")
    }
    async listAll(){
        const data = await this.getAllCarts()
        return data;
    }

    async listById(id){
        const data = await this.getCartById(id)
        return data;
    }

    async createCart(){
        const data = await this.saveCart()
        return data
    }

    async removeCart(id){
        const data = await this.deleteCart(id)
        return data
    }

    async updateCart(id, cant){
        const data = await this.addToCart(id, cant)
        return data
    }

    async removeProduct(idUser, idProd){
        const data = await this.deleteFromCart(idUser, idProd)
        return data
    }
}