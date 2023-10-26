const Post = require('../models/postModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const fs = require('fs')

const cloudinary = require('cloudinary')

// @desc create a post
// @route post api/post
// @access private
const createPost = asyncHandler(async (req, res, next) => {


 const excludesFormats = [
  'audio/midi',
  'audio / mpeg',
  'audio / webm',
  'audio / ogg',
  'audio / wav',
  'video/webm',
  'video/x-msvideo',
  'video/ogg',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
 ]
 if (excludesFormats.includes(req.file?.mimetype)) {
  fs.unlink(req.file.path, (err, data) => {
   if (err) throw err
   console.log('successfully deleted..')
  })
  return res.json({ success: false, message: 'image or picture only...' })
 }

 //  const PATH = `${process.env.BASE_URL}/${req.file.path}`
 if (!req.file && req.body) {
  const post = new Post({ ...req.body })
  post.save().then(doc => {
   if (!doc) return res.json({ success: false, message: err.message })
   return res.json({ success: true, data: doc })
  })
 } else {
  cloudinary.v2.uploader.upload(req.file.path, function (error, result) {
   if (error) {
    console.log('error acure:', error)
    return res.json({ success: false, message: error })
   }
   const post = new Post({ ...req.body, image: result?.secure_url })
   post.save().then(doc => {
    if (!doc) return res.json({ success: false, message: err.message })
    fs.unlink(req.file.path, (err, data) => {
     if (err) throw err
     console.log('successfully deleted..')
    })
    return res.json({ success: true, data: doc })
   })
  })
 }
})

// @desc create a comment on a post
// @route get api/post/:id/comment
// @access private
const createComment = asyncHandler(async (req, res, next) => {
 const post = await Post.findById(req.params.id)
 if (!post) return res.json({ success: false, message: 'post no longer exist' })

 Post.findByIdAndUpdate(
  req.params.id,
  {
   $set: { comments: [...post?.comments, req.body] },
  },
  { new: true, runValidators: true }
 )
  .then(data => {
   res.json({ success: true, data })
  })
  .catch(err => res.json({ success: false, message: err.message }))
})
// @desc delete a comment on a post
// @route delete api/post/:id/comment
// @access private

const deleteComment = asyncHandler(async (req, res, next) => {
 Post.findByIdAndUpdate(
  req.params.id,
  { $pull: { comments: { _id: req.body.commentId } } },
  { new: true, runValidators: true }
 )
  .then(data => {
   res.json({ success: true, data })
  })
  .catch(err => next(new ErrorResponse(err.message, 500)))
})

// @desc get all posts
// @route get api/post
// @access private
const getAll = asyncHandler(async (req, res, next) => {
 const user = await User.findById(req.user?._id)
 console.log('user:', user)
 let mapConc = []
 const posts = await Promise.all(
  user?.followings?.map(userId => {
   return Post.find({ userId }).populate('userId').sort({ createdAt: -1 })
  })
 )
 posts.forEach(p => mapConc.push(...p))

 return res.json({
  success: true,
  count: mapConc.length,
  data: mapConc,
 })
})
// @desc get all posts by admin
// @route get api/post/admin
// @access private/admin
const getAllAdmin = asyncHandler(async (req, res, next) => {
 const sortBy = req.query?.sort
  ? req.query?.sort.split(',').join(' ')
  : { createdAt: -1 }

 const keyword = req.query.keyword
  ? {
     $or: [
      { caption: { $regex: req.query.keyword, $options: 'i' } },
      { likes: { $regex: req.query.keyword, $options: 'i' } },
     ],
    }
  : {}

 const data = await Post.find(keyword).populate('userId').sort(sortBy)

 res.json({ success: true, count: data?.length, data })
})
// DELETE POST
const deletePost = asyncHandler(async (req, res, next) => {
 const post = await Post.findById(req.params.id)

 cloudinary.v2.uploader.destroy(post?.image, function (error, result) {
  if (error) {
   console.log('error acure:', error)
   return res.json({ success: false, message: error })
  }

  post.remove()
  res.json({ success: true, data: 'successfull deleted' })
 })
})

const deleteAll = asyncHandler(async (req, res, next) => {
 Post.deleteMany({}, (err, data) => {
  if (err) return next(new ErrorResponse(err.message))
  return res.json({ success: true, data: 'deleted successfully' })
 })
})
// @desc get user's posts
// @route get api/timeline/:id
// @access private
const getUserPost = asyncHandler(async (req, res, next) => {
 const posts = await Post.find({ userId: req.params.id })
  .populate('userId')
  .sort({
   createdAt: -1,
  })

 return res.json({ success: true, data: posts })
})

// @desc get single Post
// @route get api/post/:id
// @access private

const getById = asyncHandler(async (req, res, next) => {
 const post = await Post.findById(req.params.id).populate('userId')
 return res.json({ success: true, data: post })
})

// @desc update post
// @route put api/post/:id
// @access private

const update = asyncHandler(async (req, res, next) => {
 const post = await Post.findById(req.params.id)
 if (post.userId !== req.user._id) {
  return next(new ErrorResponse('you can only update your own post', 401))
 } else {
  const updatedOne = await post.updateOne(
   { $set: req.body },
   { new: true, runValidators: true }
  )
  res.json({ success: true, data: updatedOne })
 }
})
// @desc like or unlike a post
// @route post api/post/like/:id
// @access private
const likeUnlike = asyncHandler(async (req, res, next) => {
 const post = await Post.findById(req.params.id)

 if (!post?.likes.includes(req.user._id)) {
  const updatedOne = await Post.findByIdAndUpdate(
   req.params.id,
   { $push: { likes: req.user._id } },
   { new: true, runValidators: true }
  )
  if (!updatedOne) return next(new ErrorResponse(err.message, 500))
  res.json({ success: true, data: updatedOne })
 } else {
  const updatedOne = await Post.findByIdAndUpdate(
   req.params.id,
   { $pull: { likes: req.user._id } },
   { new: true, runValidators: true }
  )
  if (!updatedOne) return next(new ErrorResponse(err.message, 500))
  res.json({ success: true, data: updatedOne })
 }
})

module.exports = {
 createPost,
 getAll,
 getUserPost,
 getById,
 update,
 likeUnlike,
 deleteAll,
 createComment,
 deleteComment,
 deletePost,
 getAllAdmin,
}
