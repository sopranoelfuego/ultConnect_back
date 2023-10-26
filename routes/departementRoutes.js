const router = require('express').Router()
const {
 create,
 getAll,
 remove,
 update,
 departementByFaculte,
} = require('../controller/departementController')

router.route('/').get(getAll).post(create)
router.route('/:id').delete(remove).put(update)
router.route('/departementByFaculte/:id').get(departementByFaculte)

module.exports = router
