'use strict'

const { asyncHandler } = require('../../index')

describe('asyncHandler failure', () => {
    test('passes rejected errors to next', async () => {
        const error = new Error('Something went wrong')
        const next = jest.fn()

        const handler = asyncHandler(async () => {
            throw error
        })

        await handler({}, {}, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})