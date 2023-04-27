const jwt = require("jsonwebtoken");
User = require("../models/user");

const verifyToken = async(req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        decode = jwt.verify(token, process.env.API_SECRET)

        if (!decode){
            return res.sendStatus(403);
        }
            
        user = await User.findOne({_id : decode.id})

        if(user){
            req.user = user;
            next();
        }
        
    } else {
        res.sendStatus(401);
    }
};
module.exports = verifyToken;