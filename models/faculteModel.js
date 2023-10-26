const mongoose = require('mongoose')

const faculteSchema = new mongoose.Schema(
 {
  name: {
   type: String,
   required: [true, 'name please...'],
   unique: true,
  },
 },
 { timestamps: true }
)

module.exports = mongoose.model('Faculte', faculteSchema)
