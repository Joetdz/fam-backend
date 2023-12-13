const { Frame } = require('..//models/frame')
const {
  getFramelist,
  poseFrame,
  getSingleFrame,
  deleteFrame,
} = require('../utils/frame')
const { usePlan } = require('../utils/user')

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
    return res.status(200).json({
      frame: newFrame,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

const getAllFrames = async (req, res) => {
  const { createdBy, query, page, limit } = req.query
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
    } else if (query) {
      filter.query = query
      allFrames = await getFramelist(Frame, filter)
      if (allFrames && allFrames.frames.length == 0) {
        throw new Error('pas de frames crée par cet utilisateur')
      }

      res.status(200).json({
        frames: allFrames.frames,
        messega: 'Tous les frames recupérés avec succès ft',
      })
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
    res.status(501).json(error)
  }
}

const getOneFrame = async (req, res) => {
  const { id } = req.params
  try {
    let frame = {}
    const filter = {}
    if (id) {
      filter.id = id
      frame = await getSingleFrame(Frame, filter)
      if (!frame) {
        throw new Error('pas de frame trouvé')
      }

      res.status(200).json({
        frame: frame,
        message: 'Frame supprimé avec succes',
      })
    }
  } catch (error) {
    console.log(error)
    res.status(501).json(error)
  }
}

const deleteOneFrame = async (req, res) => {
  const { id } = req.params
  try {
    let frame = {}
    const filter = {}
    if (id) {
      filter.id = id
      frame = await deleteFrame(Frame, filter)
      if (!frame) {
        throw new Error('pas de frame trouvé')
      }

      res.status(200).json({
        frame: frame,
        message: 'Frame trouvé',
      })
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
    res.status(200).json({
      frames: result,
    })
  } catch (error) {
    console.log(error)
    res.status(501).json(error)
  }
}

module.exports = {
  getAllFrames,
  createFrame,
  createFanFram,
  getOneFrame,
  deleteOneFrame,
}
