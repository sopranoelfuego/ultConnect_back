const router = require('express').Router()
const { protect, autorize } = require('../middleware/authMiddlware')
const {
 createPost,
 getAll,
 getUserPost,
 getById,
 update,
 likeUnlike,
 deleteAll,
 createComment,
 deleteComment,
 deletePost,
 getAllAdmin,
} = require('../controller/postController')

router
 .route('/')
 .post(protect, createPost)
 .get(protect, getAll)
 .delete(deleteAll)
router
 .route('/:id')
 .get(protect, getById)
 .put(protect, update)
 .delete(protect, deletePost)

router.route('/admin/admin').get(getAllAdmin)
router
 .route('/:id/comment')
 .post(protect, createComment)
 .put(protect, deleteComment)
router.route('/timeline/:id').get(protect, getUserPost)
router.route('/like/:id').post(protect, likeUnlike)

module.exports = router
