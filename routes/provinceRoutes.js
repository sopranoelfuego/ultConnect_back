const router = require('express').Router()
const { create, getAll } = require('../controller/provinceController')

router.route('/').get(getAll).post(create)
module.exports = router
