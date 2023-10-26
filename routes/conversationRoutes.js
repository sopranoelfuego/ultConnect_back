const router = require('express').Router()

const {
 create,
 getByUserId,
 getInBox,
 remove,
 removeAll
} = require('../controller/conversationController')

router.route('/').post(create).delete(removeAll)
router.route('/:userId').get(getByUserId).delete(remove)
router.route('/find/:firstUserId/:secondUserId').get(getInBox)

module.exports = router

