const contenedorProductosFs = require ('../../classes/product.js')

module.exports = class ProductosDaoFileSystem extends contenedorProductosFs {
    constructor() {
        super("./db/product.txt")
    }
    async listAll(){
        const data = await this.getAll();
        return data;
    }

    async listById(id){
        const data = await this.getById(id);
        return data;
    }

    async save(product){
        const data = await this.saveProduct(product);
        return data;
    }

    async update(product, id){
        const data = await this.updateProduct(product, id)
        return data;
    }

    async delete(id){
        const data = await this.deleteById(id)
        return data
    }
}

