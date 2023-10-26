const {
 create,
 getAll,
 getByUser,
 update,
 remove,
 deleteAll,
} = require('../controller/mentionController')
const { protect } = require('../middleware/authMiddlware')

const router = require('express').Router()
router.route('/').get(getAll).post(protect, create).delete(deleteAll)
router.route('/:id').put(protect, update).get(getByUser).delete(remove)
module.exports = router
