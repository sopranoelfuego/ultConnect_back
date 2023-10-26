const Message = require('../models/messageModel')
const asyncHandler = require('express-async-handler')
const cloudinary = require('cloudinary')
const fs = require('fs')

// @desc create message
// @route post api/message
// @access private

const create = asyncHandler(async (req, res, next) => {
 if (req.file) {
  cloudinary.v2.uploader.upload(req.file.path, function (error, result) {
   if (error) {
    return res.json({ success: false, message: error })
   }

   const message = new Message({
    ...req.body,
    type: req.file.mimetype.split('/')[0].trim(),
    file: result?.secure_url,
   })
   message.save().then(doc => {
    if (!doc) return res.json({ success: false, message: err.message })
    fs.unlink(req.file.path, (err, data) => {
     if (err) throw err
    })
    return res.json({ success: true, data: doc })
   })
  })
 } else {
  const message = new Message(req.body)

  message.save((err, data) => {
   if (err) return next(err)

   res.json({ success: true, data })
  })
 }
})
// @desc delete discussion between two people
// @route delete api/message/:conversationId
// @access private
const deleteDiscussion = asyncHandler(async (req, res, next) => {
 Message.deleteMany(
  { conversationId: req.params.conversationId },
  (err, data) => {
   if (err) return next(err)

   res.json({ success: true, data })
  }
 )
})

// @desc delete discussion between two people
// @route delete api/message/:id
// @access private
const remove = asyncHandler(async (req, res, next) => {
 Message.findByIdAndDelete(req.params.id, (err, data) => {
  if (err) return next(err)
  res.json({ success: true, data })
 })
})

// @desc get Message by conversation account
// @route get api/message/:conversationId
// @access private

const getAll = asyncHandler(async (req, res, next) => {
 const messages = await Message.find({
  conversationId: req.params.conversationId,
 })
 res.json({ success: true, data: messages })
})
// @desc delete all messages
// @route get api/message/:conversationId
// @access private

const deleteAll = asyncHandler(async (req, res, next) => {
 const messages = await Message.deleteMany({})
 res.json({ success: true, data: messages })
})

module.exports = {
 create,
 getAll,
 deleteAll,
 deleteDiscussion,
 remove,
}
