const axios = require('axios')
const { createCanvas, loadImage } = require('canvas')

const insertFrame = async (frame, Frame, User) => {
  try {
    const userCheck = await User.findOne({
      facebookId: frame.createdBy,
    })
    if (!userCheck) {
      throw new Error('Utilisateur introuvable')
    }
    // } else if (userCheck.abonnement <= 0) {
    //   throw new Error('Vous  n avez plus d abonnement pour creer ce frame')
    // }

    let newFrame = null
    newFrame = await Frame.create(frame)
    const userUpdate = await User.update(
      { facebookId: frame.createdBy },
      { $push: { frames: newFrame.name }, abonnement: userCheck.abonnement - 1 }
    )
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
  console.log('filter', filter)

  try {
    const frames = filter
      ? await Frame.find({ createdBy: { $eq: filter.createdBy } })
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

const poseFrame = async (imageUrl, frameUrl) => {
  // Récupérer l'image et le frame à partir des URL
  try {
    const [image, frame] = await Promise.all([
      loadImage(imageUrl),
      loadImage(frameUrl),
    ])

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

    return {
      finalImageUrl: finalImageUrl,
    }
  } catch (error) {
    console.log('err', error)
  }
}
module.exports = { insertFrame, getFramelist, poseFrame }
