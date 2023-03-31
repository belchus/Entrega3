
const Usuarios = require("../classes/users.js");
const user = new Usuarios("./db/user.txt");


async function listAll(req, res) {
    const resultado = await user.getAll();
    return res.send(resultado);
}

async function listById(req, res) {
    const resultado = await user.getById(req.params.id);
    return res.send(resultado);
}

async function createUser(req, res) {
    const resultado = await user.save(req.body);
    return res.send(resultado);
}

async function modifyUser(req, res) {
    const resultado = await user.update(req.body, req.params.id);
    return res.send(resultado);
}

async function deleteUser(req, res) {
    const resultado = await user.deleteById(req.params.id);
    return res.send(resultado);
}

function login(req, res) {
    const resultado = user.userLogged(req.body)
    return res.send(resultado)
}

module.exports = { listAll, listById, createUser, modifyUser, deleteUser, login }