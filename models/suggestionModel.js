const mongoose = require('mongoose')

const suggestionSchema = mongoose.Schema(
 {
  user: {
   type: mongoose.Schema.ObjectId,
   rel: 'User',
  },
  category: {
   type: String,
   enum: ['claiming', 'support', 'question', 'other'],
  },
  content: String,
  fullName: String,
  viewed: {
   type: Boolean,
   default: false,
  },
 },
 { timestamps: true }
)

module.exports = mongoose.model('Suggestion', suggestionSchema)
