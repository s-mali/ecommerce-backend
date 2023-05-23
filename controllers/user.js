const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const User = require('../models/user')
const axios = require('axios')
const IP = require('ip');

exports.signUp = async (req, res) => {

    const { firstName, lastName, email, role, password } = req.body;

    bcryptPassword = bcrypt.hashSync(password, 8)

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ firstName, lastName, email, role, password: bcryptPassword });
        await user.save();

        var token = jwt.sign({
            id: user.id
        }, process.env.API_SECRET, {
            expiresIn: 86400
        });


        res.status(201).json({
            user,
            message: "user register succesfully",
            accessToken: token,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }


}

exports.login = async (req, res) => {

    if (req.body.email_verified) {

        user = await User.findOne({
            email: req.body.email
        })

        if (!user) {
            user = new User({
                firstName: req.body.given_name,
                lastName: req.body.family_name,
                email: req.body.email,
                role: 'user',
                socialLogin: true,
                userImage: req.body.picture
            });

            await user.save();

            var token = jwt.sign({
                id: user.id
            }, process.env.API_SECRET, {
                expiresIn: 86400
            });


            res.status(201).json({
                user,
                message: "user register succesfully",
                accessToken: token,
            });
        }
        else {

            if (!user.socialLogin) {
                return res.status(401)
                    .send({
                        accessToken: null,
                        message: "user not found"
                    });

            }
            else {

                var token = jwt.sign({
                    id: user.id
                }, process.env.API_SECRET, {
                    expiresIn: 86400
                });

                res.status(200)
                    .send({
                        user,
                        message: "Login successfull",
                        accessToken: token,
                    });
            }

        }

    }
    else {

        user = await User.findOne({
            email: req.body.email
        })

        if (!user) {
            return res.status(401)
                .send({
                    accessToken: null,
                    message: "user not found"
                });
        }

        if (user.socialLogin) {
            return res.status(401)
                .send({
                    accessToken: null,
                    message: "Invalid Password!"
                });

        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401)
                .send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
        }

        var token = jwt.sign({
            id: user.id
        }, process.env.API_SECRET, {
            expiresIn: 86400
        });

        res.status(200)
            .send({
                user,
                message: "Login successfull",
                accessToken: token,
            });
    }

}

exports.getUser = async (req, res) => {
    try {
        const id = req.user._id
        
        var user = await User.findOne(
            { _id: id },
            {
                password: 0,
                wishList: 0,
                socialLogin: 0,
                role: 0
            }

        )
        user = user.toObject()
        const ipResponse = await axios.get('https://api.ipify.org/?format=json')
        const ip = ipResponse.data.ip

        const response = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&ip_address=${ip}`)
        user.location = {  city : response.data.city,
                            region : response.data.region,
                            country : response.data.country
                         }
        
        if (user) {
            return res.status(200).json(user)
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'User not found' })

    }
}

exports.updateProfile = async (req, res) => {
    try {
        const id = req.user._id
        let modifiedDate = new Date()

        updatedData = req.body


        updatedData = { ...updatedData, modifiedDate }

        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { $set: updatedData },
            { 
                new: true,
                projection: { password: 0, wishList: 0, socialLogin: 0, role: 0 } 
            },
           
        )

        if (updatedUser) {
            res.status(200).json(updatedUser)
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Error at updating profile' })
    }
}

exports.uploadProfileImage = async (req, res) => {

    try {
        const id = req.user._id
        let updatedData = {}
        let modifiedDate = new Date()

        if (req.imageUrl) {
            updatedData['userImage'] = req.imageUrl
            updatedData = { ...updatedData, modifiedDate }
            const updatedUser = await User.findOneAndUpdate(
                { _id: id },
                { $set: updatedData },
                { 
                    new: true,
                    projection: { password: 0, wishList: 0, socialLogin: 0, role: 0 }  
                }
            )

            if (updatedUser) {
                res.status(200).json(updatedUser)
            }
        }
        else {
            res.status(400).json({ message: 'Error at uploading profile Image' })
        }

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Error at uploading profile Image' })
    }


}