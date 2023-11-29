module.exports = insertFrame = async (frame, Frame, User) => {
  try {
    const frameExist = await Frame.findOne({
      name: frame.name,
    })
    if (frameExist) {
      throw new Error(
        `Il est existe déjà un frame qui porte ce nom : ${frameExist.name}`
      )
    }
  } catch (error) {}
}
