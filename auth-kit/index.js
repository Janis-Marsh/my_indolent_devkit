'use strict'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const DEFAULT_SALT_ROUNDS = 10
const DEFAULT_EXPIRES_IN = '7d'
const TOKEN_KEY = 'token'

function hashPassword(plain, { saltRounds = DEFAULT_SALT_ROUNDS } = {}) {
    if (Buffer.byteLength(plain) > 72) throw new Error('password cannot exceed 72 bytes')
    return bcrypt.hash(plain, saltRounds)
}

async function comparePassword(plain, hash) {
    if (!plain || !hash) return false
    return bcrypt.compare(plain, hash)
}

function needsRehash(hash, { saltRounds = DEFAULT_SALT_ROUNDS } = {}) {
    return bcrypt.getRounds(hash) < saltRounds
}

function signToken(payload, { secret, expiresIn = DEFAULT_EXPIRES_IN } = {}) {
    if (!secret) throw new Error('secret is required')
    return jwt.sign(payload, secret, { expiresIn })
}

function verifyToken(token, { secret } = {}) {
    if (!secret) throw new Error('secret is required')
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        throw new Error('Invalid Token')
    }
}

const setToken = (storage, token, key = TOKEN_KEY) => storage.setItem(key, token)
const getToken = (storage, key = TOKEN_KEY) => storage.getItem(key)
const clearToken = (storage, key = TOKEN_KEY) => storage.removeItem(key)

module.exports = {
    hashPassword,
    comparePassword,
    needsRehash,
    signToken,
    verifyToken,
    setToken,
    getToken,
    clearToken
}