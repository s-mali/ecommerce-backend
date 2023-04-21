const Product = require('../models/products')

exports.addProduct = async (req, res)=>{
    try{
        new product = Product({
            productName : req.body.productName,
            brand : req.body.brand,
            inStock : req.body.inStock,
            discription: req.body.discription,
            price : req.body.price,
            category : req.body.category,
            productImage : req.body.productImage
        })

        await product.save();
        
        res.status(201).json({
            product,
            message : 'Product Added succesfully'
        });

    } 
    catch(err){
        console.log(err);
    }
}

exports.getProductList = async(req,res)=>{
    try{

        var products = await Product.find()

        res.send(products)

    }catch(err){
        console.log(err)
    }
}