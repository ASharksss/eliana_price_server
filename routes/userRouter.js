const Router = require('express')
const router = new Router()
const userController = require('../contollers/userController')

router.post('/create', userController.createUser)

module.exports = router