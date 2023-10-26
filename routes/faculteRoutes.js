const router = require('express').Router()
const {
 create,
 getAll,
 remove,
 getById,
} = require('../controller/faculteController')

router.route('/').get(getAll).post(create)
router.route('/:id').delete(remove).get(getById)

module.exports = router
