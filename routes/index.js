const Router = require('express')
const router = new Router()
const productRouter = require('./prodictRouter')
const brandRouter = require('./brandRouter')
const categoryRouter = require('./categoryRouter')
const userRouter = require('./userRouter')


router.use('/product', productRouter)
router.use('/brand', brandRouter)
router.use('/category', categoryRouter)
router.use('/user', userRouter)

module.exports = router