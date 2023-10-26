const router = require('express').Router()

const {
 create,
 getAll,
 remove,
 deleteDiscussion,
 deleteAll,
} = require('../controller/messageController')
const { protect } = require('../middleware/authMiddlware')
router.route('/').post(protect, create).delete(deleteAll)
router.route('/:id').delete(protect, remove)
router
 .route('/conversation/:conversationId')
 .get(protect, getAll)
 .delete(protect, deleteDiscussion)

module.exports = router
