const { User } = require('../models/user')
const { uid } = require('uid')

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

const usePlan = async (userId, planId) => {
  try {
    const user = await User.findById(userId)
    if (!user) return null
    if (!planId) {
      const id = uid(16)
      const newFreePlan = {
        id,
        planName: 'Free',
        maxUser: 25,
        date: new Date(),
        used: true,
      }
      await User.updateOne(
        { _id: userId },
        { $push: { abonnements: newFreePlan } }
      )
      return id
    }
    const selectedPlan = user.abonnements.find((abo) => abo.id == planId)
    if (!selectedPlan) return null
    const abonnements = user.abonnements.map((abo) =>
      abo.id != planId ? abo : { ...abo, used: true }
    )
    await User.updateOne({ _id: userId }, { abonnements })
    return planId
  } catch (error) {
    console.log(error)
    return null
  }
}

module.exports = { signupOrsignin, getSingleUser, getUserList, usePlan }
