
'use strict'

class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message)
        this.name = 'ApiError'
        this.statusCode = statusCode
        this.details = details
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }

    static badRequest(message = 'Bad Request', details = null) {
        return new ApiError(400, message, details)
    }

    static unauthorized(message = 'Unauthorized', details = null) {
        return new ApiError(401, message, details)
    }

    static forbidden(message = 'Forbidden', details = null) {
        return new ApiError(403, message, details)
    }

    static notFound(message = 'Not Found', details = null) {
        return new ApiError(404, message, details)
    }

    static conflict(message = 'Conflict', details = null) {
        return new ApiError(409, message, details)
    }
}

// Validation helpers

function requireFields(data, fields) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw ApiError.badRequest('Request data must be an object')
    }

    const missing = fields.filter(field =>
        data[field] === undefined ||
        data[field] === null ||
        (typeof data[field] === 'string' && !data[field].trim())
    )

    if (missing.length) {
        throw ApiError.badRequest('Missing required fields', {
            fields: missing
        })
    }

    return data
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (typeof email !== 'string' || !emailPattern.test(email)) {
        throw ApiError.badRequest('Invalid email address', {
            field: 'email'
        })
    }

    return email
}

function validateString(value, field, { minLength = 1, maxLength = Infinity } = {}) {
    if (typeof value !== 'string') {
        throw ApiError.badRequest(`${field} must be a string`, {
            field
        })
    }

    const trimmed = value.trim()

    if (trimmed.length < minLength || trimmed.length > maxLength) {
        throw ApiError.badRequest(`${field} must be between ${minLength} and ${maxLength} characters`, {
            field,
            minLength,
            maxLength
        })
    }

    return trimmed
}

// Global error handler

function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500
    let message = err.message || 'Internal server error'
    let details = err.details || null

    const isProduction = process.env.NODE_ENV === 'production'

    if (err.name === 'CastError') {
        statusCode = 400
        message = `Invalid ${err.path}: ${err.value}`
    }

    if (err.name === 'ValidationError') {
        statusCode = 400
        message = 'Validation failed'
        details = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message
        }))
    }

    if (err.code === 11000) {
        statusCode = 409
        message = `Duplicate value for: ${Object.keys(err.keyValue || {}).join(', ')}`
    }

    if (err.type === 'entity.parse.failed') {
        statusCode = 400
        message = 'Malformed JSON in request body'
    }

    if (err.type === 'entity.too.large') {
        statusCode = 413
        message = 'Request body too large'
    }

    if (statusCode >= 500) {
        console.error('[error]', {
            message: err.message,
            stack: err.stack
        })
    }

    return res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(details && { details }),
            ...(!isProduction && statusCode >= 500 && { stack: err.stack })
        }
    })
}

module.exports = {
    ApiError,
    errorHandler,
    requireFields,
    validateEmail,
    validateString
}
