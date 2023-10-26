const mongoose = require('mongoose')

const mentionSchema = new mongoose.Schema(
 {
  user: {
   type: mongoose.Schema.ObjectId,
   rel: 'User',
  },
  tagged: {
   type: mongoose.Schema.ObjectId,
   rel: 'User',
  },
  category: {
   type: String,
   enum: ['post', 'comment', 'birthday'],
  },
  viewed: {
   type: Boolean,
   default: false,
  },
  link: String,
 },
 { timestamps: true }
)
module.exports = mongoose.model('Mention', mentionSchema)
