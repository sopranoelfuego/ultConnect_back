const mongoose = require('mongoose')

const formationModel = mongoose.Schema({
 name:{
     type:String,
     unique:true,
     required: [true,"choisi le nom de la formations.."]
 },
},{ timestamps: true})
module.exports = mongoose.model('Formation', formationModel)
