const Router = require('express')
const router = new Router()

const categoryController = require('../contollers/categoryController')

router.post('/createCategory', categoryController.createCategory)

module.exports = router