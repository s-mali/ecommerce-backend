var express = require("express"),
router = express.Router()
const User = require('../controllers/user')
const userValidation = require('../validators/userValidator');
const verifyToken = require('../middleware/verifyToken')
var uploadImages = require('../utils/imageUploads');
var upload = require('../utils/imageUploads');

router.post('/signup', userValidation.signUpValidation ,User.signUp)
router.post('/login' ,userValidation.loginValidation, User.login)
router.get('/getUser', verifyToken , User.getUser)
router.patch('/updateProfile', verifyToken , User.updateProfile)
router.post('/uploadProfileImage',verifyToken, upload.upload.single('image'), uploadImages, User.uploadProfileImage)


module.exports = router
