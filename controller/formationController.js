const Formation = require('../models/formationModel')
const ErrorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('express-async-handler')

// @desc create formation
// @route post api/formation
// @access private/admin
const create = asyncHandler(async (req, res, next) => {
 const formation = new Formation(req.body)
 formation.save((err, data) => {
  if (err) {
   return next(err)
  }
  return res.json({ success: true, data })
 })
})

// @desc get formations
// @route post api/formations
// @access private/admin

const getAll = asyncHandler(async (req, res, next) => {
 const formations = await Formation.find({})
 return res.json({ success: true, data: formations })
})

// @desc delete formation
// @route delete api/formation/:id
// @access private/admin

const remove = asyncHandler(async (req, res, next) => {
 const formation = await Formation.findById(req.params.id)
 formation.remove()
 return res.json({ success: true, data: 'successfully deleted' })
})
// @desc update formation
// @route put api/formation/:id
// @access private/admin

const update = asyncHandler(async (req, res, next) => {
 const formation = await Formation.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
  runValidators: true,
 })
 return res.json({ success: true, data: formation })
})

// @desc getSingle formation
// @route post api/formations/:id
// @access private/admin
const getById = asyncHandler(async (req, res, next) => {
 const formations = await Formation.findById(req.params.id)
 res.json({ success: true, data: formations })
})

module.exports = {
 create,
 getAll,
 getById,
 remove,
 update,
}
