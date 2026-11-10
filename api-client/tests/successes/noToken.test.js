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

test('no Authorization header is sent when there is no token', async () => {
    const fetchImpl = fakeFetch(200, {})

    await createApiClient({ fetchImpl }).get('/items')

    expect(fetchImpl.mock.calls[0][1].headers.Authorization).toBeUndefined()
})