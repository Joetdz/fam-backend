const express = require('express')
const { createOrLoginUser } = require('../controllers/user')
const router = express.Router()

router.post('/login', createOrLoginUser)

module.exports = router
