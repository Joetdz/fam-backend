const express = require('express')
const { buyAbonnement } = require('../controllers/payement')

const router = express.Router()

router.post('/save-payement', buyAbonnement)

module.exports = router
