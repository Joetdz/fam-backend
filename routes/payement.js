const express = require('express')
const { buyAbonnement, sendMail } = require('../controllers/payement')

const router = express.Router()

router.post('/save-payement', buyAbonnement)
router.post('/send-email', sendMail)

module.exports = router
