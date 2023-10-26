const mongoose = require('mongoose')

const classModel = mongoose.Schema(
 {
  name: {
   type: String,
   required: [true, 'choisi le nom de la class..'],
  },
 },
 { timestamps: true }
)
module.exports = mongoose.model('Class', classModel)
