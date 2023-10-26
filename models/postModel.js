const mongoose = require('mongoose')

const postCommentSchema = new mongoose.Schema(
 {
  userId: {
   type: mongoose.Schema.ObjectId,
   ref: 'User',
   required: true,
  },
  content: {
   type: String,
   max: 200,
   required: [true, 'comment please can not be empty...'],
  },
  likes: {
   type: Array,
   default: [],
  },
  //  userId,content
 },
 { timestamps: true }
)
const postSchema = new mongoose.Schema(
 {
  userId: {
   type: mongoose.Schema.ObjectId,
   ref: 'User',
   required: [true, 'user please...'],
  },

  caption: {
   type: String,
   max: 500,
  },
  image: {
   type: String,
   default: '',
  },
  likes: {
   type: Array,
   default: [],
  },
  comments: [postCommentSchema],
 },
 { timestamps: true }
)
module.exports = mongoose.model('Post', postSchema)
