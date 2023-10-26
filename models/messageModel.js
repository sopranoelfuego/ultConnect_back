const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
 {
  content: {
   type: String,
  },
  to: {
   type: mongoose.Schema.ObjectId,
   ref: 'User',
   required: [true, 'enter to whom u send it'],
  },
  file: String,
  from: {
   type: mongoose.Schema.ObjectId,
   ref: 'User',
   required: [true, ' who send it...'],
  },
  type: {
   type: String,
   default: 'text',
   enum: ['image', 'text', 'file', 'application'],
  },
  conversationId: {
   type: mongoose.Schema.ObjectId,
   ref: 'Conversation',
   required: [true, 'conversationId is empty...'],
  },
 },
 //  content,to,from,conversationId,file,type
 { timestamps: true }
)
module.exports = mongoose.model('Message', messageSchema)
