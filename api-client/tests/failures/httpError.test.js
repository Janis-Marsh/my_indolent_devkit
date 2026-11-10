'use strict'

const { createApiClient } = require('../../index')

function fakeFetch(status, body) {
    return jest.fn(async () => ({
        ok: status >= 200 && status < 300,
        status,
        headers: { get: () => (body === undefined ? null : 'application/json') },
        json: async () => body,
        text: async () => ''
    }))
}

test('a non-2xx response throws an ApiError with the status and server message', async () => {
    const client = createApiClient({
        fetchImpl: fakeFetch(404, {
            success: false,
            error: { message: 'Not found' }
        })
    })

    await expect(client.get('/missing')).rejects.toMatchObject({
        name: 'ApiError',
        statusCode: 404,
        message: 'Not found'
    })
})