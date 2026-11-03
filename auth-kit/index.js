'use strict'

const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const jwtExpiresIn = process.env.JWT_EXPIRES_IN


function signToken(payload) {
    return jwt.sign(payload, jwtSecret, {expiresIn: jwtExpiresIn})
}

function verifyToken(token){
    try {
        return jwt.verify(token, jwtSecret)
    } catch (error) {
        throw new Error('Invalid Token')
    }
}
module.exports = {signToken, verifyToken}