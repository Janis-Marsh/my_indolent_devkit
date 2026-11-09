'use strict'

const { createCrudRouter } = require('../../index')

describe('createCrudRouter success', () => {
    const repository = {
        findAll: jest.fn().mockResolvedValue([{ id: '1' }]),
        findById: jest.fn().mockResolvedValue({ id: '1' }),
        create: jest.fn().mockResolvedValue({ id: '1' }),
        update: jest.fn().mockResolvedValue({ id: '1' }),
        remove: jest.fn().mockResolvedValue({ id: '1' })
    }

    let router

    beforeEach(() => {
        jest.clearAllMocks()
        router = createCrudRouter(repository)
    })

    async function runRoute(method, path, req = {}) {
        const route = router.stack.find(
            layer => layer.route.path === path &&
                layer.route.methods[method]
        )

        const handler = route.route.stack[0].handle
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn()
        }
        const next = jest.fn()

        await handler({
            params: {},
            body: {},
            query: {},
            ...req
        }, res, next)

        return res
    }

    test('gets all records', async () => {
        const res = await runRoute('get', '/')

        expect(repository.findAll).toHaveBeenCalledWith({})
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('gets one record', async () => {
        const res = await runRoute('get', '/:id', {
            params: { id: '1' }
        })

        expect(repository.findById).toHaveBeenCalledWith('1')
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('creates a record', async () => {
        const res = await runRoute('post', '/', {
            body: { name: 'Alex' }
        })

        expect(repository.create).toHaveBeenCalledWith({ name: 'Alex' })
        expect(res.status).toHaveBeenCalledWith(201)
    })

    test('updates a record', async () => {
        const res = await runRoute('put', '/:id', {
            params: { id: '1' },
            body: { name: 'Alex' }
        })

        expect(repository.update).toHaveBeenCalledWith('1', { name: 'Alex' })
        expect(res.status).toHaveBeenCalledWith(200)
    })

    test('deletes a record', async () => {
        const res = await runRoute('delete', '/:id', {
            params: { id: '1' }
        })

        expect(repository.remove).toHaveBeenCalledWith('1')
        expect(res.status).toHaveBeenCalledWith(204)
    })
})