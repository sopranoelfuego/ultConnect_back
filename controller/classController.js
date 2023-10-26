const Class = require('../models/classModel')
const ErrorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('express-async-handler')


// @desc create class
// @route post api/class
// @access private/admin
const create = asyncHandler(async (req, res, next) => {

    const newClass=new Class(req.body)
    newClass.save((err,data)=>{
        if(err)return next(new ErrorResponse('not saved',203))
        return res.json({ success:true,data})
    })

    
})

// @desc get classes
// @route post api/classes
// @access private/admin

const getAll = asyncHandler(async (req, res, next) => {

  const classes=await  Class.find({})
  return res.json({ success:true,data:classes})
})


module.exports={
    create,getAll
}