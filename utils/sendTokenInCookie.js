const sendTokenToResponse = (user, statusCode, res) => {
 const token = user.signWithjsonWebToken()

 const options = {
  expires: new Date(
   Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
 }
 if (process.env.NODE_ENV === 'production') {
  options.secure = true
 }
 res
  .status(statusCode)
  .cookie('token', token, options)
  .json({
   success: true,
   user: { token, id: user?._id, isAdmin: user?.isAdmin },
  })
}
module.exports = sendTokenToResponse
