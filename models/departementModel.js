const mongoose = require('mongoose')

const departementSchema = new mongoose.Schema({
 name: {
  type: String,
  required: [true, 'name please...'],
  unique: true,
 },
 idFaculte: {
  type: mongoose.Schema.ObjectId,
  ref: 'Faculte',
  required: [true, 'choose faculte please'],
 },
})

module.exports = mongoose.model('Departement', departementSchema)
