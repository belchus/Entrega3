const express = require ('express')
const router = express.Router()

//controllers requeridos
const prod = require('../controllers/productos.js')

//ruta de produtos 
router.get("/", prod.listAll);

router.get("/:id", prod.listById);

router.post("/", prod.createProduct);

router.put("/:id", prod.modifyProduct);

router.delete("/:id", prod.deleteProduct);

module.exports = router;