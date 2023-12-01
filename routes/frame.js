const express = require('express')
const {
  createFrame,
  getAllFrames,
  createFanFram,
} = require('../controllers/frame')
const router = express.Router()

router.post('/create', createFrame)
router.get('/all-frames', getAllFrames)
router.post('/use-frame', createFanFram)

module.exports = router
