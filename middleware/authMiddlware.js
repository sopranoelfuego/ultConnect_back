const asyncHandler = require('express-async-handler')

const ErrorResponse = require('../utils/errorResponse.js')
const User = require('../models/userModel')

const jwt = require('jsonwebtoken')

// protect route
exports.protect = asyncHandler(async (req, res, next) => {
 let token
 if (
  req.headers.authorization &&
  req.headers.authorization.startsWith('Bearer')
 ) {
  token = req.headers.authorization.split(' ')[1]
 }
 // check the token
 if (!token) {
  return next(new ErrorResponse('not autorized ', 401))
 }
 // then we can check the token

 try {
  // verify the token
  const decode = jwt.verify(token, process.env.JWT_SECRET)
  // as we signed with {id} the decode will handles the {id}

  req.user = await User.findById(decode.id)
//   console.log(req.user)
  if (!req.user)
   return next(
    new ErrorResponse('user not available maybe have been deleted...', 401)
   )
  next()
 } catch (error) {
  return next(new ErrorResponse('not autorized ', 401))
 }
})
// here we grant access to the user
exports.autorize = (...role) => {
 return (req, res, next) => {
  if (!role.includes(req.user.role)) {
   return next(new ErrorResponse(`USER WITH ${req.user.role}`, 403))
  }
  next()
 }
}
