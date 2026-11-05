'use strict'

const { signToken, verifyToken } = require('../../index')

const SECRET = 'test-secret-key'

test('JWT functions reject a missing or incorrect secret', () => {
    const token = signToken(
        { userId: '123' },
        { secret: SECRET }
    )

    expect(() => signToken({ userId: '123' }))
        .toThrow('secret is required')

    expect(() => verifyToken(token, { secret: 'wrong-secret' }))
        .toThrow('Invalid Token')

    expect(() => verifyToken(token))
        .toThrow('secret is required')
})