const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const multer = require('multer');
var upload = multer({ dest: './public/images' })
var upload = multer({ dest: './public/images' })
const path = require('path');
const fs = require('fs');

// multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(undefined, './public/images');
    },
    filename: function (req, file, cb) {
        cb(undefined, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

upload = multer({
    storage: storage,
    limits: { fileSize: process.env.MAX_SIZE }
});

//cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:  process.env.API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

// image upload API
async function uploadImages(req, res, next) {
    var imageUrl
    if (req.file) {

        try {
            if (req.file.size > process.env.MAX_SIZE) throw new Error('invalid Media');
        } catch (error) {
            console.log({ error });
            return res.status(400).json({ message: 'invalid Media' })
        }
        cloudinary.uploader
            .upload(req.file.path)
            .then((result) => {
                imageUrl = result.url;
                req.imageUrl = result.url;
                fs.unlinkSync(req.file.path);
                next();
            })
            .catch((error) => {
                console.log({ error });
                return res.staus(400).json({ message: 'Error at uploding' })
            });
    }

    else {
        next();
    }
}

module.exports = uploadImages;
module.exports.upload = upload;