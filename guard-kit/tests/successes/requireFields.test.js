'use strict'

const { requireFields } = require('../../index')

describe('requireFields success', () => {
    test('accepts data containing all required fields', () => {
        const data = {
            name: 'Alex',
            email: 'alex@example.com'
        }

        const result = requireFields(data, ['name', 'email'])

        expect(result).toBe(data)
    })

    test('accepts fields with additional optional properties', () => {
        const data = {
            name: 'Alex',
            email: 'alex@example.com',
            age: 21
        }

        expect(requireFields(data, ['name', 'email'])).toBe(data)
    })
})