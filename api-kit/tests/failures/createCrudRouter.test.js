'use strict'

const { createCrudRouter } = require('../../index')

describe('createCrudRouter failure', () => {
    test('passes a 404 error to next when a record is missing', async () => {
        const repository = {
            findById: jest.fn().mockResolvedValue(null)
        }

        const router = createCrudRouter(repository)

        const route = router.stack.find(
            layer => layer.route.path === '/:id' &&
                layer.route.methods.get
        )

        const handler = route.route.stack[0].handle
        const next = jest.fn()

        await handler({
            params: { id: '999' }
        }, {}, next)

        expect(next).toHaveBeenCalled()

        const error = next.mock.calls[0][0]

        expect(error.message).toBe('Record not found')
        expect(error.statusCode).toBe(404)
    })
})