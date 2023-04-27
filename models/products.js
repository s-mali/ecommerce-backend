const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName :{
        type:String,
        required : true
    },

    brand : {
        type : String,
        required : true
    },
    
    inStock : {
        type : Number,
        required : true
    },

    productImage : {
        type:String
    },

    discription : {
        type: String,
        required : true
    },

    price : {
        type : Number,
        required : true
    },

    category :{
        type : String,
        require : true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    
    modifiedDate:{
        type: Date
    }

});

module.exports=  mongoose.model('product', productSchema);
