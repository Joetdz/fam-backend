const signupOrsignin = async (user, User) => {
  try {
    const userExist = await User.findOne({
      facebookId: user.facebookId,
    })
    if (userExist) {
      return {
        user: userExist,
        error: null,
      }
    } else {
      const newUser = await User.create(user)
      return {
        user: newUser,
        error: null,
      }
    }
  } catch (error) {
    return {
      user: null,
      error: error,
    }
  }
}

module.exports = { signupOrsignin }
