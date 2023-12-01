const { User } = require('../models/user')
const { Frame } = require('..//models/frame')
const {
  insertFrame,
  getFramelist,
  poseFrame,
  fetchImage,
} = require('../utils/frame')

const createFrame = async (req, res) => {
  const frame = req.body
  try {
    if (!frame.name && !frame.createBy) {
      throw new Error(
        'Imposible de créer le frame sans le nom et sans être membre'
      )
    }
    let newFrame = null
    newFrame = await insertFrame(frame, Frame, User)
    if (!newFrame.frame) {
      throw new Error(newFrame.error)
    }
    res.status(200).json({
      frame: newFrame.frame,
      message: `Le frame a été  créé avec succès`,
    })
  } catch (error) {
    console.log(error)
    res.status(403).json(error.massage)
  }
}

const getAllFrames = async (req, res) => {
  const { createdBy } = req.query
  console.log('createdBy', createdBy)
  try {
    let allFrames = []
    const filter = {}
    if (createdBy) {
      filter.createdBy = createdBy
      allFrames = await getFramelist(Frame, filter)
      if (allFrames && allFrames.frames.length == 0) {
        throw new Error('pas de frames crée par cet utilisateur')
      }

      res.status(200).json({
        frames: allFrames.frames,
        messega: 'Tous les frames recupérés avec succès ft',
      })
    } else {
      allFrames = await getFramelist(Frame)
      if (!allFrames) {
        throw new Error('pas de frames crée par cet utilisateur')
      }

      res.status(200).json({
        frames: allFrames,
        messega: 'Tous les frames recupérés avec succès ',
      })
    }
  } catch (error) {
    console.log(error)
    res.status(403).json(error.massage)
  }
}

const createFanFram = async (req, res) => {
  const { imgUrl, frameUrl } = req.body
  const image = await fetchImage(imgUrl)
  const frame = await fetchImage(frameUrl)
  const result = poseFrame(image, frame, {
    offsetX: 10,
    offsetY: 20,
    resize: 'image',
    opacity: 0.5,
  })
  res.status(200).json({
    frames: result,
  })
}

module.exports = { getAllFrames, createFrame, createFanFram }
