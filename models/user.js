const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')
// { id: '', planName: '', maxUser: '', statut: '', date: '' }

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  frames: {
    type: Array,
  },
  facebookId: {
    type: String,
    required: true,
  },
  abonnements: {
    type: Array,
    default: [],
  },
})

userSchema.plugin(uniqueValidator)
const User = mongoose.model('user', userSchema)

module.exports = { User }
