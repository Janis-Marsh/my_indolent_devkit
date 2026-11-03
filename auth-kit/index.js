'use strict'

/**Everything JWT and token will touch this file aka logins, logouts, and authorizations */

/**A JWT stand for Javascript Web Token: It is an industry standard for securely sending information 
 * 
 */

/** Why we use tokens instead of sessions
 * 
 * JSON web tokens use 3 base64 chunks that with the secret, header(algorithm and type), make is a far more secure option than just sessions which can be interrupted, connections ...etc
 * Think back on how you interact with google gmail or facebook .....etc these major sites also use token this allows use the user to now have to deal with session reminders to stay active the, and increases the overall security of the interaction between the client and the server
 * 
 * @param {object} user
 * @returns {string} a signed token
 */

const jwt = require('jsonwebtoken')
const {jwtSecret, jwtExpiresIn} = require('../config/env')
const ApiError = require('./ApiError')

function signToken(user) {
    
    /**
     * 'sub' or subject is the standard JQE claim from : Who is this token
     * we keep the payload tiny on purpose. the users row can change at any time
     * so the id is the only thing worth carrying in. 
     * We will worry about role later when we are doing permission checks
     */
    const payload = {sub: String(user._id), role: user.role}
    return jwt.sign(payload, jwtSecret, {expiresIn: jwtExpiresIn})
}

/**verify Token will given and handing back a token
 * the jwt library throws its own error types, we use ApiError to translate so the rest of 
 * the app will still work. The makes sure that a bad token will become a clean 401 and not
 * and accident server breaking 500
 * 
 * @param {string} token
 * @param {{sub:string, role:string, iat:number, exp:number}}
 */

function verifyToken(token){
    try {
        return jwt.verify(token, jwtSecret)
    } catch (error) {
        /**this error will cover forged signatures, signed with different secret but the right fields. Also a note that when you are making error message for user input
         * is that you must make the res not too detailed. otherwise the attackers will be able to use you overly detailed error to create a forgery good enough to get into the system
         */
        throw Error('Invalid Token')
    }
}
module.exports = {signToken, verifyToken}