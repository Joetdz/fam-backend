import { User } from '../models/user'
import { signupOrsignin } from '../utils/user'
const jwt = require('jwt-simple')
import config from '../config/config'

export async function createOrLoginUser(req, res) {
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
  } catch (error) {}
}
