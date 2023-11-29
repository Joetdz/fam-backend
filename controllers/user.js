const { User } = require('../models/user')
const signupOrsignin = require('../utils/user')
const jwt = require('jwt-simple')
const config = require('../config/config')

module.exports = createOrLoginUser = async (req, res) => {
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
      userId: user,
      token: `Bearer ${token}`,
    })
  } catch (error) {
    console.log(error)
    res.status(403).json(error.massage)
  }
}
