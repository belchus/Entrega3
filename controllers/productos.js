const {productDao} = require ('../DAO/DaoGeneral.js')


async function listAll(req, res) {
    const resultado = await productDao.listAll();
    return res.send(resultado);
};

async function listById(req, res) {
    let { id } = req.params;
    const resultado = await productDao.listById(id);
    return res.send(resultado);
};

async function createProduct(req, res) {
    const resultado = await productDao.save(req.body);
    return res.send(resultado);
};

async function modifyProduct(req, res) {
    const resultado = await productDao.update(req.body, req.params.id);
    return res.send(resultado);
};

async function deleteProduct(req, res) {
    const resultado = await productDao.delete(req.params.id);
    return res.send(resultado);
}

async function randomize(cant) {
    if (isNaN(cant)) {
        const resultado = await productDao.random(5)
        return res.send(resultado);
    } else {
        const resultado = await productDao.random(cant)
        return  res.send(resultado);
    }

}
module.exports = { listAll, listById, createProduct, modifyProduct, deleteProduct,randomize}