const jwt = require('jsonwebtoken');

require('dotenv').config();

const createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        password: user.password
    }

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});

}

const verify = (req, res, next) => {
    let token = req.headers.authorization;

    if(typeof token === 'undefined') {
        return res.send({auth: 'Failed. No Token'})
    } else {
        token = token.slice(7, token.length);

        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {
            if(err){
                return res.status(404).send({
                    error: "User not found"
                })
            } else {
                req.user = decodedToken;
                next();
            }
        })
    }
}

module.exports = {createAccessToken, verify};