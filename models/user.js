const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const user = new Schema({
  name: {
    type: String,
    required: true,
  },
  frames: {
    type: Array,
  },
  facebookID: {
    type: String,
    required: true,
  },
})
userSchema.plugin(uniqueValidator)
const User = mongoose.model('user', userSchema)

module.exports = { User }
