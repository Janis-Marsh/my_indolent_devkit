'use strict'

const { createApiClient } = require('../../index')
const { ApiError } = require('../../../guard-kit')

test('a network failure throws an ApiError with status 0', async () => {
    const client = createApiClient({
        fetchImpl: jest.fn(async () => { throw new Error('offline') })
    })

    await expect(client.get('/items')).rejects.toBeInstanceOf(ApiError)
    await expect(client.get('/items')).rejects.toMatchObject({
        statusCode: 0,
        message: 'Network error: offline'
    })
})