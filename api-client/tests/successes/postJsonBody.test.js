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

test('post sends a JSON body with a content type', async () => {
    const fetchImpl = fakeFetch(201, { success: true })
    const client = createApiClient({ baseUrl: 'https://api.test', fetchImpl })

    await client.post('/items', { name: 'a' })

    const [, options] = fetchImpl.mock.calls[0]
    expect(options.body).toBe(JSON.stringify({ name: 'a' }))
    expect(options.headers['Content-Type']).toBe('application/json')
})