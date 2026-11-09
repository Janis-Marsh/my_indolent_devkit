'use strict'

const { ApiError } = require('../../index')

describe('ApiError success', () => {
    test('create a 400 bad request error', () => {
        const error = ApiError.badRequest('Invalid input')

        expect(error).toBeInstanceOf(Error)
        expect(error.statusCode).toBe(400)
        expect(error.message).toBe('Invalid input')
        expect(error.isOperational).toBe(true)
    })
})

test('creates a 401 unauthorized error', () => {
    const error = ApiError.unauthorized()

    expect(error.statusCode).toBe(401)
})

test('creates a 404 not found error', () => {
    const error = ApiError.notFound()

    expect(error.statusCode).toBe(404)
})

test('creates a 409 conflict error', () => {
    const error = ApiError.conflict()

    expect(error.statusCode).toBe(409)
})