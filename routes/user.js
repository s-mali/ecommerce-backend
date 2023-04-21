var express = require("express"),
router = express.Router()
const User = require('../controllers/user')
const userValidation = require('../validators/userValidator');


router.post('/signup', userValidation.signUpValidation ,User.signUp)
router.post('/login' ,userValidation.loginValidation, User.login)

module.exports = router