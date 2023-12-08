const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const frameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  like: {
    type: Number,
  },
  usedBy: {
    type: Array,
  },
  abonment: {
    type: String,
  },
  maxUser: {
    type: Number,
    default: 15,
  },
})

frameSchema.plugin(uniqueValidator)
const Frame = mongoose.model('frame', frameSchema)

module.exports = { Frame }
