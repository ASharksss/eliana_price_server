const Router = require('express')
const router = new Router()
const brandController = require('../contollers/brandController')

router.post('/createBrand', brandController.createBrand)

module.exports = router