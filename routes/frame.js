const express = require('express')
const {
    createFrame,
    getAllFrames,
    createFanFram,
    getOneFrame
} = require('../controllers/frame')
const router = express.Router()

router.post('/create', createFrame)
router.get('/all-frames', getAllFrames)
router.post('/use-frame', createFanFram)
router.get('/:id', getOneFrame)

module.exports = router