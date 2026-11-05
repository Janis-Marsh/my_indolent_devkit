'use strict'

const { signToken, verifyToken } = require('../../index')

const SECRET = 'test-secret-key'

test('verifyToken validates a token and returns its payload', () => {
    const payload = { userId: '123', role: 'user' }

    const token = signToken(payload, { secret: SECRET })
    const decoded = verifyToken(token, { secret: SECRET })

    expect(decoded.userId).toBe('123')
    expect(decoded.role).toBe('user')
})