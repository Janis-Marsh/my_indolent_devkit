'use strict'

const { requireFields } = require('../../index')

describe('requireFields failure', () => {
    test('throws an error when required fields are missing', () => {
        const data = {
            name: 'Alex'
        }

        expect(() => {
            requireFields(data, ['name', 'email'])
        }).toThrow('Missing required fields')
    })

    test('throws an error when a required field is empty', () => {
        const data = {
            name: '  ',
            email: 'alex@example.com'
        }

        expect(() => {
            requireFields(data, ['name', 'email'])
        }).toThrow('Missing required fields')
    })

    test('throws an error when data is not an object', () => {
        expect(() => {
            requireFields(null, ['name'])
        }).toThrow('Request data must be an object')
    })
})