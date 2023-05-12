var express = require("express"),
router = express.Router()
const checkout = require('../controllers/stripe')

router.post('/create-checkout-session', checkout.checkoutSession)

module.exports = router