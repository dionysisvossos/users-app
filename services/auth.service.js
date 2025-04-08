const jwt = require('jsonwebtoken');

function generateAccessToken(user) {

    console.log('Auth service', user);
    const payload = {
        username: user.username,
        email: user.email,
        roles: user.roles
    };

    const secret = process.env.TOKEN_SECRET;
    const options = {
        expiresIn: '3600s'
    };

    return jwt.sign(payload, secret, options);
    
}

function verifyAccessToken(token) {
    const secret = process.env.TOKEN_SECRET;
    try {
        const payload = jwt.verify(token, secret);
        console.log("Verify token", payload);
        return {verified: true, data: payload};
    } catch (err) {
        console.log("Error in decoding token", err);
        return {verified: false, data: err.message};
    }
}

module.exports = {
    generateAccessToken,
    verifyAccessToken
}