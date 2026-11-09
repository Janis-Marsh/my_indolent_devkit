'use strict'

const { sendSuccess, sendCreate } = require('../../index')

describe('sendSuccess success', () => {
    test('sends a successful response with status 200', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        sendSuccess(res, { name: 'Alex' })

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: { name: 'Alex' }
        })
    })

    test('sendCreate uses status 201', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }

        sendCreate(res, { name: 'Alex' })

        expect(res.status).toHaveBeenCalledWith(201)
    })
})