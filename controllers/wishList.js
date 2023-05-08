const mongoose = require('mongoose');
const User = require('../models/user')

exports.addUserWishList = async (req, res) => {

    try {
        const user = req.user

        if(user.wishList.includes(req.body.productId)){
            return res.status(401).json({ message: 'Already in your wishList'})

        }
        user.wishList = [...user.wishList, req.body.productId]

        const wishList = await User.updateOne({ _id: user._id },
            {
                $set: { wishList: user.wishList }

            })

        if (wishList) {
            res.status(201).json({ message: 'wishlist added Sussecfully' })
        }
        else{
            res.status(401).json({ message: 'Error on updating Wishlist' })
        }
    }catch(err){
        console.log(err);
        res.status(401).json({ message: 'Error on updating Wishlist' })
    }

    
}


exports.getWishList = async (req,res) => {

    try{

       const list = await req.user.populate('wishList')

       const wishList = list['wishList']
        
       if(wishList){
            res.status(201).json(wishList)
       }
       else{
            res.status(400).json({ message: 'wishlist not found' })
       }       

    }catch(err){
        console.log(err);
        res.status(400).json({ message: 'wishlist not found' })
    }
}

exports.deleteFromWishList = async(req,res) =>{
    try{
        const userId = req.user._id
        const productId = new mongoose.Types.ObjectId(req.params.productId)

        const  removed = await User.updateOne(
            { _id: userId },
            { $pull: { wishList: productId } }
        )

        if(removed){
            res.status(201).json({ message: 'Removed from Wishlist' })
        }else{
            res.status(400).json({ message: 'Error at deleting WishList' })
        }


    }catch(err){
        console.log(err)
        res.status(400).json({ message: 'Error at deleting WishList' })
    }
}