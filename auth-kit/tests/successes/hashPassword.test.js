'use strict'

const { hashPassword, comparePassword } = require('../../index')

test('hashPassword creates a hash that can be compared', async () => {
    const password = 'MyPassword123'

    const hash = await hashPassword(password)

    expect(hash).not.toBe(password)
    expect(await comparePassword(password, hash)).toBe(true)
})