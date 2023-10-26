const router = require('express').Router()
const { create, getAll, remove } = require('../controller/suggestionController')

router.route('/').get(getAll).post(create)
router.route('/:id').delete(remove)

module.exports = router
