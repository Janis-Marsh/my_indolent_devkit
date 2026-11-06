'use strict'

const mongoose = require('mongoose')
const db = require('../../index')

const MODEL_NAME = `ModelTest_${Date.now()}`

afterAll(() => {
    mongoose.deleteModel(MODEL_NAME)
})

test('defineModel creates and registers a new model', () => {
    const schema = db.createSchema({
        title: { type: String, required: true }
    })

    const Model = db.defineModel(MODEL_NAME, schema)

    expect(Model).toBeDefined()
    expect(Model.modelName).toBe(MODEL_NAME)
    expect(mongoose.models[MODEL_NAME]).toBe(Model)
})
