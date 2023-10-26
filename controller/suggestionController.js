const Suggestion = require('../models/suggestionModel')
const ErrorResponse = require('../utils/errorResponse.js')

const asyncHandler = require('express-async-handler')

const getAll = asyncHandler(async (req, res, next) => {
 Suggestion.find({}, (err, data) => {
  if (err) return next(new ErrorResponse(err.message))
  return res.json({ success: true, count: data.length, data })
 }).sort({ createdAt: -1 })
})

const create = asyncHandler(async (req, res, next) => {
 const suggestion = new Suggestion(req.body)

 suggestion.save((err, data) => {
  if (err) return next(new ErrorResponse(err.message))
  return res.json({ success: true, data })
 })
})
const remove = asyncHandler(async (req, res, next) => {
 const suggestion = await Suggestion.findByIdAndDelete(req.params.id)
 if (!suggestion) {
  return next(new ErrorResponse('error not removed', 201))
 }
 return res.json({ success: true, data: 'successfully deleted...' })
})

module.exports = { getAll, create, remove }
