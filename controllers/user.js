const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const User = require('../models/user')

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
                socialLogin: true
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
