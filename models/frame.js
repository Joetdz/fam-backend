const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const frameSchema = new Schema(
  {
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
    likes: {
      type: [String],
      default: [],
    },
    usedBy: {
      type: [String],
      default: [],
    },
    planId: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

frameSchema.plugin(uniqueValidator)
frameSchema.index({'$**': 'text'});
const Frame = mongoose.model('frame', frameSchema)

module.exports = { Frame }
