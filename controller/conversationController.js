
const ErrorResponse = require('../utils/errorResponse.js')
const Conversation = require('../models/conversationModel')
const asyncHandler = require('express-async-handler')

// @desc create conversation
// @route post api/conversation
// @access private
const create = asyncHandler(async (req, res, next) => {
 const conversation = new Conversation({
  members: [req.body.senderId, req.body.receiverId],
 })
 conversation.save((err, data) => {
  if (err) return next(new ErrorResponse('not saved', 201))
  res.json({ success: true, data })
 })
})
// @desc get user conversation
// @route get api/conversation/:userId
// @access private

const getByUserId = asyncHandler(async (req, res, next) => {
const data=await Conversation.find({ members: { $in: [req.params.userId] }}).sort({createdAt: -1})
 
return res.json({success:true,data})
})
// @desc get conversation inbox
// @route get api/conversation/find/:firstUserId/:secondUserId
// @access private
const getInBox = asyncHandler(async (req, res, next) => {
 
 Conversation.find(
  {
   //    members: {
   // $all: [req.params.firstUserId, req.params.secondUser],
   $and: [
    { members: req.params.firstUserId },
    { members: req.params.secondUserId },
   ],
   //    },
  },
  (err, data) => {
   if (err) return next(new ErrorResponse('not data found', 404))
   res.json({ success: true, data })
  }
 )
})
const removeAll=asyncHandler(async (req, res, next) => {
    await Conversation.deleteMany({})
    res.json({ success: true, data :"deleted successfull"})
})
const remove=asyncHandler(async (req, res, next) => {
    const conv= await Conversation.findById(req.params.userId)
   await  conv.remove()
   res.json({ success: true, data })

})

module.exports = {
 create,
 getByUserId,
 getInBox,
 remove,
 removeAll
}
