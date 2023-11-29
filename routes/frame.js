const express = require('express')
const { createFrame, getAllFrames } = require('../controllers/frame')
const router = express.Router()

router.post('/create', createFrame)
router.get('/all-frames', getAllFrames)

module.exports = router
