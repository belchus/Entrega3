const express = require ('express')
const router = express.Router()
const usr = require('../controllers/usuarios.js')

router.get("/", usr.listAll);

router.get("/:id", usr.listById);

router.post("/", usr.createUser);

router.put("/:id", usr.modifyUser);

router.delete("/:id", usr.deleteUser);

router.post('/login', usr.login)

module.exports = router;