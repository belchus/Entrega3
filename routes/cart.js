const express = require ('express')
const router = express.Router()
const cart = require('../controllers/cart.js')


router.get("/", cart.listAll);

router.get("/:id/productos", cart.listById);

router.post("/", cart.createCart);

router.post("/:id/productos", cart.addProduct);

router.delete("/:id", cart.deleteCart);

router.delete("/:id/productos/:id_prod", cart.removeProductById);

module.exports = router;