'use strict'

const mongoose = require('mongoose')
const db = require('../../index')

const MODEL_NAME = `SchemaTest_${Date.now()}`
const IDEMPOTENT_MODEL_NAME = `${MODEL_NAME}_Idempotent`

afterAll(() => {
    mongoose.deleteModel(MODEL_NAME)
    mongoose.deleteModel(IDEMPOTENT_MODEL_NAME)
})

test('createSchema enables timestamps by default', () => {
    const schema = db.createSchema({
        title: String
    })

    expect(schema.options.timestamps).toBe(true)
})

test('createSchema hides specified paths and formats the ID', () => {
    const schema = db.createSchema({
        title: String,
        secret: String
    }, {
        hidePaths: ['secret']
    })

    const TestModel = db.defineModel(MODEL_NAME, schema)

    const document = new TestModel({
        title: 'Test Item',
        secret: 'private'
    })

    const result = document.toJSON()

    expect(result.id).toBeDefined()
    expect(result._id).toBeUndefined()
    expect(result.secret).toBeUndefined()
    expect(result.title).toBe('Test Item')
})

test('defineModel returns an existing model instead of redefining it', () => {
    const firstSchema = db.createSchema({
        title: String
    })

    const secondSchema = db.createSchema({
        name: String
    })

    const firstModel = db.defineModel(
        IDEMPOTENT_MODEL_NAME,
        firstSchema
    )

    const secondModel = db.defineModel(
        IDEMPOTENT_MODEL_NAME,
        secondSchema
    )

    expect(secondModel).toBe(firstModel)
})
