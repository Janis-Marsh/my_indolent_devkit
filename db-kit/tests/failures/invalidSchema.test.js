'use strict'

const db = require('../../index')

test('createSchema rejects an invalid schema type', () => {
    expect(() => db.createSchema({
        title: { type: 'NotARealType' }
    })).toThrow(/Invalid schema configuration/)
})

test('createSchema rejects an undefined path definition', () => {
    expect(() => db.createSchema({
        title: undefined
    })).toThrow(/Invalid value for schema path/)
})