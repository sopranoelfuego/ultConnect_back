const router = require('express').Router()
const {
 getAll,
 register,
 deleteAll,
 deleteAccount,
 getById,
 login,
 updatePassword,
 updateUserDetails,
 getFollowers,
 getFollowings,
 follow,
 forgetPassword,
 resetPassword,
 getByEmail,
 removeFollower,
} = require('../controller/userController')
const { protect, admin } = require('../middleware/authMiddlware')
router.route('/').get(getAll).post(register).delete(deleteAll)
router.route('/followings/:id').get(protect, getFollowings)

router
 .route('/followers/:id')
 .get(protect, getFollowers)
 .delete(protect, removeFollower)
router.route('/follow').post(protect, follow)
router.route('/byemail/:email').get(getByEmail)
router
 .route('/:id')
 .get(getById)
 .delete(protect, deleteAccount)
 .put(protect, updateUserDetails)
router.route('/password').post(protect, updatePassword)
router.route('/forgetpassword').post(forgetPassword)
router.route('/resetpassword').put(resetPassword)
router.route('/auth').post(login)

module.exports = router
