const Departement = require('../models/departementModel')
const ErrorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('express-async-handler')

// @desc create departement
// @route post api/departement
// @access private/admin

const create = asyncHandler(async (req, res, next) => {
 const departement = new Departement(req.body)
 departement.save((err, data) => {
  if (err)
   return next(
    new ErrorResponse(`not saved  
        ${err}`),
    203
   )
  return res.json({ success: true, data })
 })
})

// @desc get all departements
// @route get api/departement
// @access private

const getAll = asyncHandler(async (req, res, next) => {
 const departements = await Departement.find({})
 res.json({ success: true, data: departements })
})

// @descr remove departement
// @routes delete api/departement/:id
// @access private/admin
const remove = asyncHandler(async (req, res, next) => {
 Departement.findByIdAndDelete(req.params.id, (err, data) => {
  if (err) return next(new ErrorResponse(`not deleted ${err}`), 203)
  res.json({ success: true, data })
 })
})

// @descr get departements according to a specific faculte
// @routes get api/departementbyfaculte/:id
// @access public
const departementByFaculte = asyncHandler(async (req, res, next) => {
 Departement.find({ idFaculte: req.params.id }, (err, data) => {
  if (err)
   return next(new ErrorResponse(`departements not available ${err}`), 203)
  res.json({ success: true, data })
 })
})

// @descr updated departement
// @routes PUT api/departement/:id
// @access private/admin
const update = asyncHandler(async (req, res, next) => {
 const data = await Departement.findByIdAndUpdate(req.params.id, req.body, {
  runValidators: true,
  new: true,
 })
 if (!data) return res.json({ success: false, message: 'not updated' })
 return res.json({ success: true, data })
})

module.exports = {
 create,
 getAll,
 remove,
 update,
 departementByFaculte,
}
