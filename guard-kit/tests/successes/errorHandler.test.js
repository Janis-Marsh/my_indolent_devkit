'use strict'

const { ApiError, errorHandler } = require('../../index')

describe('errorHandler success', () => {
    test('returns the correct API error response', () => {
        const error = ApiError.notFound('Record not found', {
            id: '123'
        })

        const req = {}
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        errorHandler(error, req, res, jest.fn())

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: 'Record not found',
                details: { id: '123' }
            }
        })
    })
})