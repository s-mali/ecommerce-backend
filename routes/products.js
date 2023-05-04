var express = require("express"),
router = express.Router()
const Product = require('../controllers/products')
const  productValidation  = require('../validators/productsValidator')
const verifyToken = require('../middleware/verifyToken')

var uploadImages = require('../utils/imageUploads');
var upload = require('../utils/imageUploads');
const { array } = require("joi");

router.post('/addProduct', upload.upload.single('image'), uploadImages,  Product.addProduct)
router.get('/getProducts', Product.getProductList);
router.get('/deleteProduct/:productId', Product.deleteProduct);
router.post('/updateProduct/:productId', upload.upload.single('image'), uploadImages, Product.updateProduct)
router.get('/getProduct/:productId', Product.getProduct)

router.patch('/uploadImages/:productId',  );

module.exports = router