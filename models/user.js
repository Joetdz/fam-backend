const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

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
  abonnement: {
    type: Number,
    default: 0,
  },
})

userSchema.plugin(uniqueValidator)
const User = mongoose.model('user', userSchema)

module.exports = { User }
