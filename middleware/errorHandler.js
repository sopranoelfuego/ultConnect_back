const ErrorResponse = require('../utils/errorResponse.js')

const errorHandler = (err, req, res, next) => {
 let error = { ...err }
 error.message = err.message

 // case of bad objectId
 if (err.name === 'Error') {
  let message = `Ressources not found with  such id ${req.params.id}`
  error = new ErrorResponse(err.message, 403)
 }
 // @descr duplication code for mongoose object
 if (err.code === 11000) {
  let message = `value already exist...`
  error = new ErrorResponse(message, 400)
 }
 if (err.name === 'validationError') {
  let message = Object.values(err.errors).map(val => val.message)
  error = new ErrorResponse(message, 400)
 }

 res.json({
  success: false,
  message: error.message || 'server error...',
  statusCode: error.statusCode,
 })
}
module.exports = errorHandler
