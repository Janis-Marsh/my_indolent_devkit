'use strict'

const { sendNoContent } = require('../../index')

describe('sendNoContent success', () => {
    test('sends status 204 with no response body', () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        }

        sendNoContent(res)

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.send).toHaveBeenCalled()
    })
})