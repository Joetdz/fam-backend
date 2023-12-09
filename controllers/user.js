const { User } = require('../models/user')
const { signupOrsignin, getUserList } = require('../utils/user')
const jwt = require('jwt-simple')
const config = require('../config/config')

const createOrLoginUser = async (req, res) => {
  const user = req.body

  try {
    if (!user.facebookId) {
      throw new Error('Compte facebook invalide')
    }
    let newUser = null
    newUser = await signupOrsignin(user, User)
    if (!newUser.user) {
      throw new Error(newUser.error)
    }
    const playload = {
      id: user.facebookId,
      name: user.name,
      expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }

    const token = jwt.encode(playload, config.jwtSecret)
    res.status(200).json({
      userId: newUser.user,
      token: `Bearer ${token}`,
    })
  } catch (error) {
    console.log(error)
    res.status(403).json(error.massage)
  }
}

const getAllUsers = async (req, res) => {
  try {
    let allUsers = []

    allUsers = await getUserList(User)
    if (!allUsers) {
      throw new Error('pas de utilisateurs trouvés')
    }

    res.status(200).json({
      users: allUsers,
      messega: 'Tous les utilisateurs recupérés avec succès ',
    })
  } catch (error) {
    console.log(error)
    res.status(501).json(error)
  }
}

const getOneUser = async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(301).json({ message: 'You must provide an id' })
  try {
    const user = await User.findById(id)
    return res.json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

module.exports = { createOrLoginUser, getOneUser, getAllUsers }
