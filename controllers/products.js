const { response } = require('express');
const Product = require('../models/products')

exports.addProduct = async (req, res)=>{
    try{

        let body = JSON.parse(JSON.stringify(req.body));
        var product = new Product({
            productName : body.productName,
            brand : body.brand,
            inStock :body.inStock,
            discription: body.discription,
            price : body.price,
            category : body.category,
            productImage : req.imageUrl
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

        total = await Product.countDocuments();
        const pageNo = req.query.page
        const limit  = req.query.limit
        var products = await Product.find().sort({'createdAt': -1}).skip((pageNo-1)*10).limit(limit)

        res.send({total,products})

    }catch(err){
        console.log(err)
    }
}


exports.deleteProduct = async (req,res)=>{
    try{
        let id = req.params.productId
        const data = await Product.findByIdAndDelete(id)
        if(data){
            res.status(201).json({message : 'Delete Succesfully'})   
        }
        else{
            res.status(401).json({message : 'Error At delete Product'});
        }   

    }catch(err){
        console.log(err)
    }
}


exports.updateProduct = async (req, res) => {
    try {

        let body = JSON.parse(JSON.stringify(req.body));

        let id =  req.params.productId 
        let modifiedDate = new Date()
        let updatedData = body
        
        if(req.imageUrl){
            updatedData['productImage'] = req.imageUrl
        }

        updatedData = { ...updatedData, modifiedDate }
        
        const result = await Product.findOneAndUpdate(
            { _id : id },
            {$set: updatedData},
            { new: true } 
            )
        
        if(result){
            res.status(200).json(result)
        }
        else{
            res.status(401).json({message : 'Product Not Found'});
        }

    }
    catch (err) {
        res.status(401).json({message : 'Product Not Found'});
    }
}

exports.getProduct = async(req,res) => {
    try{
        const id = req.params.productId

        const product = await Product.findOne({_id : id});

        if(product){
            res.status(201).json(product)
        }
        else{
            res.status(401).json({message : 'Product Not Found'});
        }

    }
    catch(err){
        console.log(err);
        res.status(401).json({message : 'Product Not Found'});
    }
}

exports.filterProducts = async(req,res) => {
    try{
        const { name , categories} = req.body

        var result = await Product.aggregate([
            {
                $match: {
                  category: { $in: categories }
                }
              }
        ]) .exec()

        res.status(201).json(result)

    }catch(err){
        console.log(err)
        res.status(400).json({message : 'Products Not Found'});
    }
}