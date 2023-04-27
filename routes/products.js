var express = require("express"),
router = express.Router()
const Product = require('../controllers/products')
const  productValidation  = require('../validators/productsValidator')
const verifyToken = require('../middleware/verifyToken')

router.post('/addProduct', productValidation.productValidation, Product.addProduct)
router.get('/getProducts', Product.getProductList);
router.get('/deleteProduct/:productId', Product.deleteProduct);
router.post('/updateProduct/:productId', Product.updateProduct)
router.get('/getProduct/:productId', Product.getProduct)


module.exports = router