const router = require('express').Router()
const { create, getAll } = require('../controller/classController')

router.route('/').get(getAll).post(create)
module.exports = router
