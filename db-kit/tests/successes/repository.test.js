'use strict'

require('dotenv').config({ quiet: true })

const mongoose = require('mongoose')
const db = require('../../index')

const MONGODB_URI = process.env.MONGODB_URI
const MODEL_NAME = `RepositoryTest_${Date.now()}`
const COLLECTION = `repository_test_${Date.now()}`

const schema = db.createSchema({
    title: { type: String, required: true },
    status: { type: String }
}, {
    collection: COLLECTION
})

const Model = db.defineModel(MODEL_NAME, schema)
const repository = db.createRepository(Model)

if (MONGODB_URI) {
    beforeAll(async () => {
        await db.connectDatabase(MONGODB_URI)
    })

    beforeEach(async () => {
        await Model.deleteMany({})
    })

    afterAll(async () => {
        if (db.isConnected()) {
            await Model.collection.drop().catch(() => {})
            await db.disconnectDatabase()
        }

        mongoose.deleteModel(MODEL_NAME)
    })

    test('creates a document', async () => {
        const item = await repository.create({
            title: 'Alpha',
            status: 'active'
        })

        expect(item.title).toBe('Alpha')
        expect(item.status).toBe('active')
        expect(item._id).toBeDefined()
    })

    test('finds a document by ID', async () => {
        const item = await repository.create({
            title: 'Find Test',
            status: 'active'
        })

        const found = await repository.findById(item._id)

        expect(found).not.toBeNull()
        expect(found.title).toBe('Find Test')
    })

    test('finds all documents matching a filter', async () => {
        await repository.create({
            title: 'Alpha',
            status: 'active'
        })

        await repository.create({
            title: 'Beta',
            status: 'inactive'
        })

        const results = await repository.findAll({
            status: 'active'
        })

        expect(results).toHaveLength(1)
        expect(results[0].title).toBe('Alpha')
    })

    test('updates a document by ID', async () => {
        const item = await repository.create({
            title: 'Original',
            status: 'active'
        })

        const updated = await repository.update(item._id, {
            title: 'Updated',
            status: 'inactive'
        })

        expect(updated.title).toBe('Updated')
        expect(updated.status).toBe('inactive')
    })

    test('removes a document by ID', async () => {
        const item = await repository.create({
            title: 'Remove Test',
            status: 'active'
        })

        const removed = await repository.remove(item._id)
        const found = await repository.findById(item._id)

        expect(removed).not.toBeNull()
        expect(found).toBeNull()
    })
} else {
    test.skip('repository CRUD operations require MongoDB', () => {})
}
