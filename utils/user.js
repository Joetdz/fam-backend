
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


const getUserList = async (User) => {

  try {
    const users = await User.find()

      
    if (!users || users.length === 0) {
      throw new Error('Aucuns utilisateurs trouvés')
    }

    return {
      users: users,
      error: null,
    }
  } catch (error) {
    return {
      users: [],
      error: error.message,
    }
  }
}

const getSingleUser = async (User, filter) => {
  try {
    const user = await User.findOne({
      _id: { $eq: filter.id },
    })
    if (!user) {
      throw new Error('Aucun utilisateur trouvé avec cette id')
    }
    return {
      user: user,
      error: null,
    }
  } catch (error) {
    return {
      user: {},
      error: error.message,
    }
  }
}


module.exports = { signupOrsignin, getSingleUser, getUserList }
