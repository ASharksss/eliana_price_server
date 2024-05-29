const Router = require('express')
const router = new Router()
const userController = require('../contollers/userController')
const {isAuthorized} = require("../middleware/authMiddleware");

router.post('/create', userController.createUser)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/login/access-token', userController.loginToAccessToken)
router.get('/getUser', isAuthorized, userController.getUser)

module.exports = router