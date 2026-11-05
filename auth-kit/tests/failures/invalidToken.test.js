'use strict'

const { verifyToken } = require('../../index')

const SECRET = 'test-secret-key'

test('verifyToken rejects an invalid token', () => {
    expect(() => verifyToken('invalid.token.value', { secret: SECRET }))
        .toThrow('Invalid Token')
})