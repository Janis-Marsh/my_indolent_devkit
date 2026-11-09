'use strict'

const { validateEmail, validateString } = require('../../index')

describe('validation helpers success', () => {
    test('accepts a valid email address', () => {
        const result = validateEmail('alex@example.com')

        expect(result).toBe('alex@example.com')
    })

    test('accepts a valid string within the length limits', () => {
        const result = validateString('Alex', 'name', {
            minLength: 2,
            maxLength: 60
        })

        expect(result).toBe('Alex')
    })

    test('trims whitespace from a valid string', () => {
        const result = validateString(' Alex ', 'name')

        expect(result).toBe('Alex')
    })
})