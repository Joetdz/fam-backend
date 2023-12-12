const axios = require('axios')
const { createCanvas, loadImage } = require('canvas')
const { User } = require('../models/user')

async function checkAvailability(arr, val) {
  return val ? arr.find((arrVal) => val === arrVal) : 'Free'
}

const insertFrame = async (frame, Frame, User, abonnement) => {
  try {
    const userCheck = await User.findOne({
      facebookId: frame.createdBy,
    })
    const checkAbonnement = await checkAvailability(
      userCheck.abonnements,
      abonnement.id
    )

    if (!userCheck) {
      throw new Error('Utilisateur introuvable')
    } else if (userCheck.abonnement <= 0) {
      throw new Error('Vous  n avez plus d abonnement pour creer ce frame')
    }

    let newFrame = null
    let userUpdate = {}

    if (checkAbonnement === 'Free') {
      newFrame = await Frame.create(frame)
      userUpdate = await User.update(
        { facebookId: frame.createdBy },
        { $push: { frames: newFrame.name }, abonnement: 'Free' }
      )
    } else if (!checkAbonnement || checkAbonnement.length <= 0) {
      throw new Error(
        "Vous  n'avez pas d'abonnement pour creer ce frame, veuillez passer à la formule supérieure"
      )
    } else {
      newFrame = await Frame.create(frame)
      userUpdate = await User.update(
        { facebookId: frame.createdBy },
        {
          $push: { frames: newFrame.name },
          abonnement: userCheck.abonnement - 1,
        }
      )
    }

    if (!userUpdate) {
      throw new Error(
        'Quelque chose s est mal passée lors de l attribution de la propriéte de ce frame '
      )
    }
    return {
      frame: newFrame,
      error: null,
    }
  } catch (error) {
    return {
      frame: null,
      error: error,
    }
  }
}
const getFramelist = async (Frame, filter) => {
  try {
    const frames =
      filter && filter.createdBy && !filter.query
        ? await Frame.find({ createdBy: { $eq: filter.createdBy } })
        : filter && filter.query
          ? await Frame.find({
              $or: [
                { name: { $regex: new RegExp(filter.query, 'i') } },
                { description: { $regex: new RegExp(filter.query, 'i') } },
              ],
            })
          : filter && filter.page && filter.limit
            ? await Frame.find()
                .limit(filter.limit * 1)
                .skip((filter.page - 1) * filter.limit)
            : await Frame.find()

    if (!frames || frames.length === 0) {
      throw new Error('Aucun frame trouvé')
    }

    return {
      frames: frames,
      error: null,
    }
  } catch (error) {
    return {
      frames: [],
      error: error.message,
    }
  }
}

const getSingleFrame = async (Frame, filter) => {
  try {
    const frame = await Frame.findOne({
      _id: { $eq: filter.id },
    })
    if (!frame) {
      throw new Error('Aucun frame trouvé')
    }
    return {
      frame: frame,
      error: null,
    }
  } catch (error) {
    return {
      frames: {},
      error: error.message,
    }
  }
}
const deleteFrame = async (Frame, filter) => {
  try {
    const frame = await Frame.findByIdAndDelete({
      _id: filter.id,
    })
    if (!frame) {
      throw new Error('Aucun frame trouvé')
    }
    return {
      frame: frame,
      error: null,
    }
  } catch (error) {
    return {
      frames: {},
      error: error.message,
    }
  }
}

const uploadFile = async (file, precept) => {
  try {
    const formdata = new FormData()
    formdata.append('file', file)
    formdata.append('upload_preset', precept)
    const { data } = await axios.post(
      `${process.env.CLOUD_URL}/${process.env.CLOUD_NAME}/image/upload`,
      formdata
    )
    return data.url
  } catch (error) {
    console.log(error)
    return null
  }
}

const poseFrame = async (imageUrl, frameId, userId, frameEntity) => {
  // Récupérer l'image et le frame à partir des URL
  try {
    const frameExist = await frameEntity.findOne({
      _id: { $eq: frameId },
    })

    if (!frameExist) {
      throw new Error('Frame introuvable')
    }

    const user = await User.findById(frameExist.createdBy)
    if (!user || !user.abonnements.some((abo) => abo.id == frameExist.planId)) {
      throw new Error('Plan inexistant pour ce frame')
    }
    const plan = user.abonnements.find((abo) => abo.id == frameExist.planId)
    if (frameExist.usedBy.length >= plan.maxUser) {
      throw new Error('Utilisations depassées')
    }

    const frame = await loadImage(frameExist.imgUrl)

    const image = await loadImage(imageUrl)

    if (!image) {
      throw new Error('Impossible de charger le frame')
    }

    // Créer un canevas de la taille de l'image
    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')

    // Dessiner l'image sur le canevas
    ctx.drawImage(image, 0, 0, image.width, image.height)

    // Dessiner le frame sur l'image
    ctx.drawImage(frame, 0, 0, image.width, image.height)

    // Convertir le canevas en une image base64
    const combinedImage = canvas.toDataURL('image/png')
    if (!combinedImage) {
      throw new Error(
        "Quelque chose s'est mal passé lors de l'association du frame et l'image"
      )
    }
    const finalImageUrl = await uploadFile(combinedImage, process.env.PRECEPT)
    if (!finalImageUrl) {
      throw new Error("Impossible d'envoyer L'image à cloudinary")
    }
    const addUserInUsedFrame = await frameEntity.update(
      { _id: { $eq: frameId } },
      { $push: { usedBy: userId }, maxUser: 15 }
    )
    if (!addUserInUsedFrame) {
      throw new Error(
        "impossible d'ajouter le user dans la liste des users du frame"
      )
    }
    return {
      finalImageUrl: finalImageUrl,
      error: null,
    }
  } catch (error) {
    console.log(error)
    return { finalImageUrl: null, error: error.message }
  }
}

module.exports = {
  insertFrame,
  getFramelist,
  poseFrame,
  getSingleFrame,
  deleteFrame,
}
