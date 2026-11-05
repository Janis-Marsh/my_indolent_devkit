'use strict'

const { setToken, getToken, clearToken } = require('../../index')

function createStorage() {
    const data = {}

    return {
        setItem(key, value) {
            data[key] = value
        },
        getItem(key) {
            return data[key] ?? null
        },
        removeItem(key) {
            delete data[key]
        }
    }
}

test('token storage can set, get, and clear a token', () => {
    const storage = createStorage()

    setToken(storage, 'sample-token')

    expect(getToken(storage)).toBe('sample-token')

    clearToken(storage)

    expect(getToken(storage)).toBe(null)
})