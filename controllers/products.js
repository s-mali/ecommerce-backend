const Product = require('../models/products')

exports.addProduct = async (req, res)=>{
    try{
        var product = new Product({
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
        let id =  req.params.productId
        let modifiedDate = new Date()
        let updatedData = req.body

        updatedData = { ...updatedData, modifiedDate }
        
        const result = await Product.updateOne({ _id : id },
            {
                $set: updatedData
                    
            })

        if(result){
            res.status(200).json(updatedData)
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