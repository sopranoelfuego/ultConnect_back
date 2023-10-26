const Mention = require('../models/mentionsModel')
const asyncHandler = require('express-async-handler')

// @desc create mention
// @route post api/mention
// @access private
const create = asyncHandler(async (req, res, next) => {
 const mention = new Mention(req.body)
 mention.save((err, data) => {
  if (err) return next(new ErrorResponse('not saved', 203))
  return res.json({ success: true, data })
 })
})

// @desc create getall
// @route GET api/mention
// @access private
const getAll = asyncHandler(async (req, res, next) => {
 const data = await Mention.find({}).populate('user')
 return res.json({ success: true, data })
})

// @desc  getall mentions by user seen or not seen
// @route GET api/mention/:id
// @access private
const getByUser = asyncHandler(async (req, res, next) => {
 if (req.query?.viewed) {
  const data = await Mention.find({
   tagged: req.params.id,
   viewed: false,
  })
   //    .populate('user')
   .sort({ createdAt: -1 })
  return res.json({ success: true, data })
 } else {
  const data = await Mention.find({ tagged: req.params.id })
  return res.json({ success: true, data })
 }
})

// @desc  update mention
// @route PUT api/mention/:id
// @access private
const update = asyncHandler(async (req, res, next) => {
 const data = await Mention.findByIdAndUpdate(
  req.params.id,
  { viewed: true },
  {
   runValidators: true,
   new: true,
  }
 )
 return res.json({ success: true, data })
})
// @desc
// @route DELETE api/mention/:id
// @access private
const remove = asyncHandler(async (req, res, next) => {
 const data = await Mention.findByIdAndDelete(req.params?.id)

 return res.json({ success: true, data })
})
// @desc delete all
// @route DELETE api/mention
// @access private/admin
const deleteAll = asyncHandler(async (req, res, next) => {
 const data = await Mention.deleteMany({})
 if (data) return res.json({ success: true, message: 'successfull deleted' })
 res.json({ success: true, message: 'not deleted' })
})
module.exports = {
 create,
 getAll,
 getByUser,
 update,
 deleteAll,
 remove,
}
