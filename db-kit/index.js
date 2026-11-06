
'use strict'

const mongoose = require('mongoose')

let listenersAttached = false

function attachListeners() {
    if (listenersAttached) return

    listenersAttached = true

    mongoose.connection.on('connected', () => {
        console.log(`MongoDB Connected: ${mongoose.connection.name}`)
    })

    mongoose.connection.on('error', (err) => {
        console.error(`MongoDB error: ${err.message}`)
    })

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected')
    })
}

async function connectDatabase(uri) {
    if (!uri) throw new Error('MongoDB URI is required')

    mongoose.set('strictQuery', true)
    attachListeners()

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000
        })
    } catch (err) {
        throw new Error(`Couldn't connect to MongoDB: ${err.message}`, {
            cause: err
        })
    }
}

async function disconnectDatabase() {
    await mongoose.disconnect()
}

function isConnected() {
    return mongoose.connection.readyState === 1
}

function createSchema(definition, { hidePaths = [], ...schemaOptions } = {}) {
    return new mongoose.Schema(definition, {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id

                for (const path of hidePaths) {
                    delete ret[path]
                }

                return ret
            }
        },
        toObject: { virtuals: true },
        ...schemaOptions
    })
}

function defineModel(name, schema) {
    return mongoose.models[name] || mongoose.model(name, schema)
}

function createRepository(Model) {
    if (!Model) throw new Error('Model is required')

    const create = (data) => Model.create(data)

    const findById = async (id) =>
        mongoose.isValidObjectId(id) ? Model.findById(id) : null

    const findAll = (filter = {}) =>
        Model.find(filter)

    const update = async (id, data) =>
        mongoose.isValidObjectId(id)
            ? Model.findByIdAndUpdate(
                id,
                data,
                { new: true, runValidators: true }
            )
            : null

    const remove = async (id) =>
        mongoose.isValidObjectId(id)
            ? Model.findByIdAndDelete(id)
            : null


    return {
        create,
        findAll,
        findById,
        update,
        remove
    }
}

module.exports = {
    connectDatabase,
    disconnectDatabase,
    isConnected,
    createSchema,
    defineModel,
    createRepository
}
