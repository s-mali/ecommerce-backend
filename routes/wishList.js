var express = require("express"),
router = express.Router()
const wishList = require('../controllers/wishList')
const verifyToken = require('../middleware/verifyToken')

router.post('/addToWishlist', verifyToken ,wishList.addUserWishList)
router.get('/getWishlist', verifyToken, wishList.getWishList)
router.get('/deleteFromWishlist/:productId', verifyToken, wishList.deleteFromWishList)

module.exports = router