const { Frame } = require('..//models/frame')
const { User } = require('../models/user')
const { sendCreateFrameMail } = require('../services/email')
const { getFramelist, poseFrame, deleteFrame } = require('../utils/frame')
const { usePlan, checkPlan } = require('../utils/user')

const createFrame = async (req, res) => {
  const { createdBy, name, description, imgUrl, planId } = req.body
  if (!createdBy || !name || !imgUrl)
    return res.status(400).json({
      message: 'You must provide name, planId, imgUrl and createdBy',
    })
  try {
    // Check if user has the selected plan and use it
    const abonmentId = await usePlan(createdBy, planId)
    if (!abonmentId) return res.status(401)

    const newFrame = await Frame.create({
      createdBy,
      name,
      imgUrl,
      description,
      planId: abonmentId,
    })
    const user = await User.findById(createdBy)
    if (user && user.email) {
      sendCreateFrameMail(user)
    }
    return res.status(200).json({
      frame: newFrame,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

const upGradeFramPlan = async (req, res) => {
  const { frameId, planId, createdBy } = req.body
  try {
    if (!frameId | !planId | createdBy)
      throw new Error('Vous devez fournir frameId , planId et createdBy')

    const abonmentId = await checkPlan(createdBy, planId)
    if (!abonmentId) return res.status(401)
    const updateFramePlan = await Frame.updateOne(
      {
        _id: { $eq: frameId },
      },
      { planId: abonmentId }
    )

    if (!updateFramePlan.modifiedCount === 0)
      throw new Error('Le changement de plan n est pas passé ')
    return res.status(200).json({ message: updateFramePlan })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

const getAllFrames = async (req, res) => {
  const { createdBy, query, page, limit } = req.query
  try {
    let allFrames = []
    const filter = {}
    if (createdBy) {
      filter.createdBy = createdBy
      allFrames = await getFramelist(Frame, filter)
      if (allFrames && allFrames.frames.length == 0) {
        throw new Error('pas de frames crée par cet utilisateur')
      }

      res.status(200).json(allFrames.frames)
    } else if (query) {
      const frames = await Frame.find({
        $or: [
          { description: { $regex: query, $options: 'i' }},
          { name: { $regex: query, $options: 'i' }},
        ],
      })
      return res.json(frames.filter((f) => !f.deleted))
    } else if (page && limit) {
      filter.page = page
      filter.limit = limit

      allFrames = await getFramelist(Frame, filter)
      if (allFrames && allFrames.frames.length == 0) {
        throw new Error('Pas de frame disponible')
      }

      res.status(200).json({
        frames: allFrames.frames,
        messega: 'Tous les frames recupérés avec succès',
      })
    } else {
      const frames = await Frame.find()

      return res.status(200).json(frames.filter((f) => !f.deleted))
    }
  } catch (error) {
    console.log(error)
    res.status(501).json(error)
  }
}

const getOneFrame = async (req, res) => {
  const { id } = req.params
  try {
    const frame = await Frame.findById(id)
    return res.json({
      frame: {
        frame,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(501).json(error)
  }
}

const deleteOneFrame = async (req, res) => {
  const { id } = req.params
  try {
    const filter = {}
    if (id) {
      filter.id = id
      await deleteFrame(Frame, filter)
      res.status(201).json({ success: true })
    }
  } catch (error) {
    console.log(error)
    res.status(501).json(error)
  }
}

const createFanFram = async (req, res) => {
  const { imgUrl, frameId, userId } = req.body

  // console.log('url', imgUrl, frameUrl)
  try {
    const result = await poseFrame(imgUrl, frameId, userId, Frame)
    if(result.error) {
      return res.status(500).json(result.error)
    }
    res.status(200).json({
      frames: result,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

module.exports = {
  getAllFrames,
  createFrame,
  createFanFram,
  getOneFrame,
  deleteOneFrame,
  upGradeFramPlan,
}
