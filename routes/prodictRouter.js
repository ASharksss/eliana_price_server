const Router = require('express')
const router = new Router()
const productController = require('../contollers/productController')
const {isAuthorized} = require("../middleware/authMiddleware");

router.post('/create', productController.createProduct)
router.post('/addInBasket', isAuthorized, productController.addInBasket)
router.get('/getBasket', isAuthorized, productController.getBasket)
router.get('/getAll',isAuthorized, productController.getAll)
router.put('/updateCountBasket', isAuthorized, productController.updateCountBasket)

module.exports = router