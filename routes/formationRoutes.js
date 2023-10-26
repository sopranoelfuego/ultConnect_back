const router = require('express').Router()
const {
 create,
 getAll,
 getById,
 remove,
 update,
} = require('../controller/formationController')

router.route('/').get(getAll).post(create)
router.route('/:id').get(getById).put(update).delete(remove)
module.exports = router
