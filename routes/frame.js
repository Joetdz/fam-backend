const express = require('express')
const {
  createFrame,
  getAllFrames,
  createFanFram,
  getOneFrame,
  deleteOneFrame,
} = require('../controllers/frame')
const router = express.Router()

router.post('/create', createFrame)
router.get('/all-frames', getAllFrames)
router.post('/use-frame', createFanFram)
router.get('/:id', getOneFrame)
router.delete('/:id', deleteOneFrame)

module.exports = router
