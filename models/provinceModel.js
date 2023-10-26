const mongoose = require('mongoose')

const provinceSchema = mongoose.Schema({
 name:{
     type:String,
     required: [true," province.."]
 },
},{ timestamps: true})
module.exports = mongoose.model('Province', provinceSchema)
