const router = require('express').Router()
const {
dashBoardData
} = require('../controller/dashBoardController.js')

router.route('/').get(dashBoardData)


module.exports = router
