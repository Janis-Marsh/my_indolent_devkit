'use strict'

const { validateEmail, validateString } = require('../../index')

describe('validation helpers failure', () => {
    test('rejects an invalid email address', () => {
        expect(() => {
            validateEmail('not-an-email')
        }).toThrow('Invalid email address')
    })

    test('rejects a non-string email', () => {
        expect(() => {
            validateEmail(123)
        }).toThrow('Invalid email address')
    })

    test('rejects a string shorter than the minimum length', () => {
       expect(() => {
        validateString('A', 'name', {
            minLength: 2,
            maxLength: 60
        })
       }).toThrow('name must be between 2 and 60 characters')
    })

    test('rejects a string longer than the maximum length', () => {
       expect(() => {
        validateString('Robert', 'name', {
            minLength: 2,
            maxLength: 5
        })
       }).toThrow('name must be between 2 and 5 characters')
    })

    test('rejects a non string value', () => {
       expect(() => {
        validateString(123, 'name')
       }).toThrow('name must be a string')
    })
})