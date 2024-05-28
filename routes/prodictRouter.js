const Router = require('express')
const router = new Router()
const productController = require('../contollers/productController')
const {isAuthorized} = require("../middleware/authMiddleware");

router.post('/create', productController.createProduct)
router.post('/addInBasket', isAuthorized, productController.addInBasket)
router.delete('/deleteInBasket', isAuthorized, productController.deleteInBasket)
router.delete('/deleteAllInBasket', isAuthorized, productController.deleteAllInBasket)
router.get('/getBasket', isAuthorized, productController.getBasket)
router.get('/getAll',isAuthorized, productController.getAll)
router.put('/updateCountBasket', isAuthorized, productController.updateCountBasket)
router.put('/updatePriceBasketItem', isAuthorized, productController.updatePriceBasketItem)
router.post('/sendExcel', isAuthorized, productController.sendExcel)
router.get('/getOrders', isAuthorized, productController.getOrders)
router.get('/getOrderList/:id', isAuthorized, productController.getOrderList)
router.post('/copyOrder', isAuthorized, productController.copyOrder)

module.exports = router