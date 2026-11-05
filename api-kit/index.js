'use strict'

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

function sendSuccess(res, data, statusCode = 200, extra={}) {
    return res.status(statusCode).json({success:true, data, ...extra})
}

function sendCreate(res, data) {
    return sendSuccess(res, data, 201)
}

function sendNoContent(res) {
    return res.status(204).send()
}

function createCrudRouter() {}