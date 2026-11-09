'use strict'

const express = require('express')
const { ApiError } = require('../guard-kit')

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

function createCrudRouter(repository) {
    const router = express.Router()

    router.get('/', asyncHandler(async (req, res) => {
        const records = await repository.findAll(req.query)
        return sendSuccess(res, records)
    }))

    router.post('/', asyncHandler(async (req, res) => {
        const record = await repository.create(req.body)
        return sendCreate(res, record)
    }))

    router.get('/:id', asyncHandler(async (req, res) => {
        const record = await repository.findById(req.params.id)

        if (!record) throw ApiError.notFound('Record not found')

        return sendSuccess(res, record)
    }))

    router.put('/:id', asyncHandler(async (req, res) => {
        const record = await repository.update(req.params.id, req.body)

        if (!record) throw ApiError.notFound('Record not found')

        return sendSuccess(res, record)
    }))

    router.delete('/:id', asyncHandler(async (req, res) => {
        const record = await repository.remove(req.params.id)

        if (!record) throw ApiError.notFound('Record not found')

        return sendNoContent(res)
    }))

    return router
}

module.exports = {
    asyncHandler,
    sendSuccess,
    sendCreate,
    sendNoContent,
    createCrudRouter
}