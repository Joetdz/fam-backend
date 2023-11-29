const insertFrame = async (frame, Frame, User) => {
  try {
    const frameExist = await Frame.findOne({
      name: frame.name,
    })
    if (frameExist) {
      throw new Error(
        `Il  existe déjà un frame qui porte ce nom : ${frameExist.name}`
      )
    }
    const userCheck = await User.findOne({
      facebookId: frame.createdBy,
    })
    if (!userCheck) {
      throw new Error('Utilisateur introuvable')
    } else if (userCheck.abonnement <= 0) {
      throw new Error(' avez plus d abonnement pour creer ce frame')
    }

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
  try {
    if (filter) {
      const frames = await Frame.find({ where: filter })
      if (!frames) {
        throw new Error('Aucun frame trouvé')
      }
      return {
        frames: frames,
        error: null,
      }
    } else {
      const frames = await Frame.find()
      if (!frames) {
        throw new Error('Aucun frame trouvé')
      }
      return {
        frames: frames,
        error: null,
      }
    }
  } catch (error) {
    return {
      frames: null,
      error: error.message,
    }
  }
}
module.exports = { insertFrame, getFramelist }
