'use strict'

const db = require('../../index')

test('createRepository rejects an invalid model', () => {
    expect(() => db.createRepository(null)).toThrow(
        'Model is required'
    )
})

test('createRepository rejects an undefined model', () => {
    expect(() => db.createRepository(undefined)).toThrow(
        'Model is required'
    )
})
