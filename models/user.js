const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true ,
        lowercase: true,
        trim: true,
        required: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: '{VALUE} is not a valid email!'
        }

    },

    role: {
        type: String,
        enum: ["user", "admin"],
        required: true
    },

    socialLogin:{
        type:Boolean,
        default: false
    },

    password: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    modifiedDate:{
        type: Date
    },

    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        }
    ]
})

module.exports = mongoose.model('user', userSchema)
