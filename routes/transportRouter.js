const Router = require('express')
const router = new Router()

const transportController = require('../contollers/transportController')

router.get('/getTransportCompanies', transportController.getTransportCompanies)
router.get('/getFieldNames', transportController.getFieldNames)
router.post('/createWaybills', transportController.createWaybills)

module.exports = router