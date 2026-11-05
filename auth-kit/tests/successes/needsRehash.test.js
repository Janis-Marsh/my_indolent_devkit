'use strict'

const { needsRehash } = require('../../index')
const bcrypt = require('bcryptjs')

test('needsRehash detects when password salt rounds need updating', async () => {
    const weakHash = await bcrypt.hash('MyPassword123', 8)
    const strongHash = await bcrypt.hash('MyPassword123', 10)

    expect(needsRehash(weakHash, { saltRounds: 10 })).toBe(true)
    expect(needsRehash(strongHash, { saltRounds: 10 })).toBe(false)
})