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

// exports.uploadImages = async (req, res) => {
//     try {
//         if (req.imageUrls) {
//             const productId = req.params.productId

//             const updated = await Product.updateOne(
//                 { _id: productId },
//                 {
//                     $push: {
//                       images: {
//                         $each: req.imageUrls
//                       }
//                     }
//                 }
//             )
//             console.log("====>>>",updated);
//             if(updated){
//                 var images = req.imageUrls
//                 res.status(201).json({images, message: 'Added images to product' })
//             }else{
//                 res.status(400).json({ message: 'Error at Uploading Images' })
//             }

//         } else {
//             res.status(401).json({ message: 'Product Not Found' });
//         }

//     } catch (err) {
//         console.log(err);
//         res.status(401).json({ message: 'Product Not Found' });
//     }
// }