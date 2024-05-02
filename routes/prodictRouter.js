const Router = require('express')
const router = new Router()
const productController = require('../contollers/productController')

router.post('/create', productController.createProduct)
router.get('/getAll', productController.getAll)

module.exports = router