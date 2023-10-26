const Faculte = require('../models/faculteModel')
const ErrorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('express-async-handler')

// @desc create Faculte
// @route post api/Faculte
// @access private/admin

const create = asyncHandler(async (req, res, next) => {
 const faculte = new Faculte(req.body)
 faculte.save((err, data) => {
  if (err)
   return next(
    new ErrorResponse(`not saved  
        ${err}`),
    203
   )
  return res.json({ success: true, data })
 })
})

// @desc get all Facultes
// @route get api/faculte
// @access private

const getAll = asyncHandler(async (req, res, next) => {
 const data = await Faculte.find({})
 res.json({ success: true, data })
})
// @desc get  Faculte by id
// @route get api/faculte:id
// @access public

const getById = asyncHandler(async (req, res, next) => {
 const data = await Faculte.findById(req.params.id)
 res.json({ success: true, data })
})

// @descr remove Faculte
// @routes delete api/faculte/:id
// @access private/admin
const remove = asyncHandler(async (req, res, next) => {
 Faculte.findByIdAndDelete(req.params.id, (err, data) => {
  if (err) return next(new ErrorResponse(`not deleted ${err}`), 203)
  res.json({ success: true, data })
 })
})

module.exports = {
 create,
 getAll,
 remove,
 getById,
}
