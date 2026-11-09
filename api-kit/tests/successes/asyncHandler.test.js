'use strict'

const { asyncHandler } = require('../../index')

describe('asyncHandler success', () => {
    test('runs an asynchronous handler', async () => {
        const handler = jest.fn()
        const next = jest.fn()

        const wrapped = asyncHandler(handler)

        await wrapped({}, {}, next)

        expect(handler).toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
    })
})