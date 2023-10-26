const asyncHandler = require('express-async-handler')
const ErrorResponse = require('../utils/errorResponse.js')
const User = require('../models/userModel')
const sendTokenInCookie = require('../utils/sendTokenInCookie')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary')
const sendEmail = require('../utils/sendEmail')
const fs = require('fs')

// @desc register a user
// @route post api/user/register
// @access public
const register = asyncHandler(async (req, res, next) => {
  console.log("register:",req.body)
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
 if (excludesFormats.includes(req.file.mimetype)) {
  fs.unlink(req.file.path, (err, data) => {
   if (err) throw err
  })
  return res.json({ success: false, message: 'image or picture only...' })
 }

 cloudinary.v2.uploader.upload(req.file.path, function (error, result) {
  if (error) {
   return res.json({ success: false, message: error })
  }
  const user = new User({ ...req.body, profilePicture: result?.secure_url })

  user.save().then(async usr => {
   if (usr !== user) {
    return res.json({ success: false, message: 'user not saved...' })
   }
   fs.unlink(req.file.path, (err, data) => {
    if (err) throw err
   })

   const token = await usr.signWithjsonWebToken()
   res.json({ success: true, token })
  })
 })
})

// @desc login a user
// @route post api/user/login
// @access public
const login = asyncHandler(async (req, res, next) => {
 const { email, password } = req.body
 if (!email || !password) {
  return next(new ErrorResponse('enter email and password', 400))
 }
 const user = await User.findOne({ email })

 if (!user) return next(new ErrorResponse('invalid credentials...', 401))
 const isValid = await user.matchPassword(password?.trim())
 if (!isValid) {
  return next(new ErrorResponse('wrong password...', 403))
 } else sendTokenInCookie(user, 200, res)
})

// @desc get single user with email
// @route get api/user/email
// @access private
const getByEmail = asyncHandler(async (req, res, next) => {
 const { email } = req.params
 const user = await User.findOne({ email })
 if (!user) {
  return next(new ErrorResponse('user not found...', 403))
 } else sendTokenInCookie(user, 200, res)
})
// @desc get single user
// @route get api/user/:id
// @access private
const deleteAll = asyncHandler(async (req, res, next) => {
 User.deleteMany({}, (err, data) => {
  if (err) return next(new ErrorResponse(err.message, 203))
  res.json({ success: true, data: 'successully deleted...' })
 })
})
const getById = asyncHandler(async (req, res, next) => {
 if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return next(new ErrorResponse('invalid id', 404))
 }
 const user = await User.findById(req.params.id).populate([
  { path: 'departement', select: 'name' },
  { path: 'faculte', select: 'name' },
  { path: 'class', select: 'name' },
 ])

 if (!user) return next(new ErrorResponse('ressource not found..', 201))
 res.json({ success: true, user })
})
// @desc get all users
// @route get /api/user
// @access private

// similar to people from frontend
const getAll = asyncHandler(async (req, res) => {

 const pageSize = 10
 const page = Number(req.query.pageNumber) || 1
 const sortBy = req.query?.sort
  ? req.query?.sort.split(',').join(' ')
  : { createdAt: -1 }

 const keyword =
  req.query.keyword && req.query.keyword?.length > 0
   ? {
      $or: [
       { username: { $regex: req.query.keyword, $options: 'i' } },
       { email: { $regex: req.query.keyword, $options: 'i' } },
       { schoolYear: { $regex: req.query.keyword, $options: 'i' } },
      ],
     }
   : {}
 let finalSearchFilter = {}

 if (req.query.keyword) {
  finalSearchFilter = keyword
 } else finalSearchFilter = req.query

 const users = await User.find(finalSearchFilter)
  .populate([
   { path: 'class', select: 'name' },
   { path: 'faculte', select: 'name' },
   { path: 'departement', select: 'name' },
  ])
  .sort(sortBy)
  .limit(pageSize)
  .skip(pageSize * (page - 1))

 return res.json({
  success: true,
  count: users.length,
  users,
 })
})
// @desc delete account
// @route delete api/user/:id
// @access private
const deleteAccount = asyncHandler(async (req, res, next) => {
 //  I MUST UNCOMMENT THIS INOTHER TO ASSUME THAT THIS IS THE OWNER OR ADMIN

 const user = await User.findById(req.params.id)
 if (req.user?._id.toString() == req.params.id.toString()) {
  await user.remove()

  if (!user) return next(new ErrorResponse('user not found', 403))
  return res.json({ success: true, data: 'successfully removed' })
 } else if (req.user?.isAdmin) {
  await user.remove()

  if (!user) return next(new ErrorResponse('user not found', 403))
  return res.json({ success: true, data: 'successfully removed' })
 } else {
  return res.json({
   success: false,
   message: 'you can only delete your own account',
  })
 }
})

// @desc update account
// @route put api/user/:id
// @access private

const updateUserDetails = asyncHandler(async (req, res, next) => {
 if (req.file) {
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
  if (excludesFormats.includes(req.file.mimetype)) {
   fs.unlink(req.file.path, (err, data) => {
    if (err) throw err
   })
   return res.json({ success: false, message: 'image  only...' })
  }

  cloudinary.v2.uploader.upload(req.file.path, function (error, result) {
   // result.

   if (error) {
    return res.json({ success: false, message: error })
   }

   User.findByIdAndUpdate(
    req.params.id,
    { profilePicture: result?.secure_url },
    function (err, data) {
     if (err) {
      return res.json({ success: false, message: err })
     }

     fs.unlink(req.file.path, (err, data) => {
      if (err) throw err
     })
     res.json({ success: true, data })
    }
   )
  })
 } else {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
   runValidators: true,
   new: true,
  })
  user.save()
  res.json({ success: true, data: user })
 }
})

// @desc update password
// @route post api/user/password
// @access private

const updatePassword = asyncHandler(async (req, res, next) => {
 const user = await User.findOne({ password: req.body.oldPassword })
 if (!user) return res.json({ success: false, message: 'wrong password....' })
 user.password = req.body.newPassword
 await user.save()
 return res.json({ success: true, message: 'password successfully updated..' })
})

// @desc get followers
// @route get api/user/followers/:id
// @access private

const getFollowers = asyncHandler(async (req, res, next) => {
 const user = await User.findById(req.params.id)
 if (!user)
  return next(new ErrorResponse(`no user with such id ${req.params.id}`, 404))
 const followers = await Promise.all(
  user.followers.map(userId => {
   return User.findById(userId).populate([
    { path: 'departement' },
    { path: 'faculte' },
    { path: 'class' },
   ])
  })
 )

 return res.json({ success: true, data: followers })
})
// @desc get followings
// @route get api/user/followings/:id
// @access private
const getFollowings = asyncHandler(async (req, res, next) => {
 const user = await User.findById(req.params.id)
 if (!user)
  return next(new ErrorResponse(`no user with such id ${req.params.id}`, 404))

 const followings = await Promise.all(
  user.followings.map(userId => {
   return User.findById(userId).populate([
    { path: 'departement' },
    { path: 'faculte' },
    { path: 'class' },
   ])
  })
 )

 return res.json({ success: true, data: followings })
})

// @desc unfollow  a user
// @route post api/user/unfollow/:id
// @access private
const follow = asyncHandler(async (req, res, next) => {
 var currentUser = await User.findById(req.user._id)
 const followedUser = await User.findById(req.body.id)
 if (req.body.id.toString() === req.user._id.toString()) {
  return res.json({ success: false, message: 'you cannot follow yourself...' })
 }
 if (currentUser.followings.includes(req.body.id)) {
  currentUser = await User.findByIdAndUpdate(
   req.user._id,
   { $pull: { followings: req.body.id } },
   { new: true, runValidators: true }
  )
  const user = await User.findByIdAndUpdate(
   req.body.id,
   { $pull: { followers: req.user._id } },
   { new: true, runValidators: true }
  )
  return res.json({ success: true, data: user })
 } else {
  currentUser = await User.findByIdAndUpdate(
   req.user._id,
   { $push: { followings: req.body.id } },
   { new: true, runValidators: true }
  )
  const user = await User.findByIdAndUpdate(
   req.body.id,
   { $push: { followers: req.user._id } },
   { new: true, runValidators: true }
  ).populate([{ path: 'formation' }, { path: 'class' }])
  return res.json({ success: true, data: user })
 }
})
// @desc user forget password
// @route post api/user/forgetpassword
// @access public
const forgetPassword = asyncHandler(async (req, res, next) => {
 const user = await User.findOne({ email: req.body.email })

 if (!user) {
  return next(new ErrorResponse('There is no user with that email', 404))
 }

 // Get reset token
 const resetToken = await user.getResetPasswordToken()

 await user.save({ validateBeforeSave: false })

 // Create reset url
 const resetUrl = `${req.protocol}://${req.get(
  'host'
 )}/api/user/resetpassword/${resetToken}`

 const message = `You receive this email because you (or someone else) has requested the reset the password. Please click to the link below to confirm request : \n\n ${resetUrl}`

 try {
  await sendEmail({
   email: user?.email,
   subject: 'Password reset token',
   message,
  })

  res.json({
   success: true,
   data: 'An email has been sent ,please check to confirm ...',
  })
 } catch (err) {
  user.resetPassordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save({ validateBeforeSave: false })

  return next(new ErrorResponse('Email could not be sent', 500))
 }
})
// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public

const resetPassword = asyncHandler(async (req, res, next) => {
 // Get hashed token
 // resetPassordToken: String,
 // resetPasswordExpire: Number,
 // const expireTime = Date.now() + 30 * 60 * 1000
 //  'update admin_users set PASSWORD_RESET_TOKEN=?,RESET_PASSWORD_EXPIRE=? where EMAIL=?'

 // Set new password
 const user = await User.findOne({
  resetPassordToken: req.params.forgetpassword,
 })
 if (!user)
  return next(
   new ErrorResponse('le token est expirer ou invalide veuillez reesayer ', 403)
  )

 user.password = req.body.newPassword
 user.resetPassordToken = undefined
 user.resetPasswordExpire = undefined
 await user.save()

 sendTokenToResponse(user, 200, res)
})

// @desc      remove followers
// @route     DELETE /api/v1/user/followers/:id
// @access    private

const removeFollower = asyncHandler(async (req, res, next) => {
 const user = await User.findByIdAndUpdate(
  req.user?._id,
  { $pull: { followers: req.params?.id } },
  { new: true, runValidators: true }
 )
 if (!user) return next(new ErrorResponse('error user not found', 404))
 res.json({ success: true, data: user })
})
module.exports = {
 getAll,
 register,
 deleteAccount,
 deleteAll,
 getById,
 login,
 updateUserDetails,
 updatePassword,
 getFollowers,
 getFollowings,
 follow,
 forgetPassword,
 resetPassword,
 getByEmail,
 removeFollower,
}
