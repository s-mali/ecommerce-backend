var express = require("express"),
router = express.Router()
const Product = require('../controllers/products')
const  productValidation  = require('../validators/productsValidator')

router.post('/addProduct', productValidation.productValidation, Product.addProduct)
router.get('/getProducts' , Product.getProductList)