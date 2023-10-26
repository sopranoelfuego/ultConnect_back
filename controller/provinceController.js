const Province = require('../models/provinceModel')
const ErrorResponse = require('../utils/errorResponse.js')

const asyncHandler = require('express-async-handler')


const getAll = asyncHandler(async (req, res, next) => {
    Province.find({},(err,data)=>{
        if(err)return next(new ErrorResponse(err.message))
        return res.json({success:true,count:data.length,data})
    })
})

const create = asyncHandler(async (req, res, next) => {
    const province=new Province(req.body)
    province.save((err,data)=>{
        if(err)return next(new ErrorResponse(err.message))
        return res.json({success:true, data})
    })
})

module.exports={getAll,create}