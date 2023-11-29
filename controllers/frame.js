const { User } = require('../models/user')
const { Frame } = require('..//models/frame')
const { insertFrame, getFramelist } = require('../utils/frame')

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
  try {
    let allFrames = null
    const filter = {}
    if (createdBy) {
      filter.createBy = createdBy

      allFrames = await getFramelist(Frame, filter)
      if (!allFrames) {
        throw new Error('pas de frames crée par cet utilisateur')
      }

      res.status(200).json({
        frames: allFrames,
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

module.exports = { getAllFrames, createFrame }
