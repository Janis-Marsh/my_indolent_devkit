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

test('get sends the bearer token and returns parsed JSON', async () => {
    const fetchImpl = fakeFetch(200, { success: true, data: [1, 2] })
    const client = createApiClient({
        baseUrl: 'https://api.test',
        getToken: () => 'abc',
        fetchImpl
    })

    const result = await client.get('/items')

    expect(result).toEqual({ success: true, data: [1, 2] })
    expect(fetchImpl).toHaveBeenCalledWith('https://api.test/items', expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ Authorization: 'Bearer abc' })
    }))
})