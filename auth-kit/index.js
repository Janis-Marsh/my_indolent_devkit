'use strict'

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { ApiError } = require('../guard-kit')

const DEFAULT_SALT_ROUNDS = 10
const DEFAULT_EXPIRES_IN = '7d'
const TOKEN_KEY = 'token'

function hashPassword(plain, { saltRounds = DEFAULT_SALT_ROUNDS } = {}) {
    if (typeof plain !== 'string') throw ApiError.badRequest('password must be a string')
    if (Buffer.byteLength(plain) > 72) throw ApiError.badRequest('password cannot exceed 72 bytes')
    return bcrypt.hash(plain, saltRounds)
}

async function comparePassword(plain, hash) {
    if (!plain || !hash) return false
    return bcrypt.compare(plain, hash)
}

function needsRehash(hash, { saltRounds = DEFAULT_SALT_ROUNDS } = {}) {
    try {
        return bcrypt.getRounds(hash) < saltRounds
    } catch (error) {
        throw ApiError.badRequest('Invalid password hash')
    }
}

function signToken(payload, { secret, expiresIn = DEFAULT_EXPIRES_IN } = {}) {
    if (!secret) throw ApiError.badRequest('secret is required')
    return jwt.sign(payload, secret, { expiresIn })
}

function verifyToken(token, { secret } = {}) {
    if (!secret) throw ApiError.badRequest('secret is required')
    try {
        return jwt.verify(token, secret)
    } catch (error) {
        throw ApiError.unauthorized('Invalid Token')
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