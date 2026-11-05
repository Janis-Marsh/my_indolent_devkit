'use strict'

const mongoose = require('mongoose')

let listenersAttached = false

function attachListeners() {
    if (listenersAttached) return
    
    listenersAttached = true
    mongoose.connection.on('connected', () => {
        console.log(`MongoDB Connected: ${mongoose.connection.name}`)
    })
    mongoose.connection.on('error', () => {
        console.log(`MongoDB error: ${err.message}`)
    })
    mongoose.connection.on('disconnected', () => {
        console.log(`MongoDB disconnected`)
    })
}

async function connectDatabase(uri) {
    mongoose.set("strictQuery", true)
    attachListeners()

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS:10000
        })
    } catch (err) {
        console.log(`Couldn't connect to MongoDB: ${err.message}`)
        process.exit(1)
    }
}
async function disconnectDatabase() {
    await mongoose.connection.close()
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
                for (const path of hidePaths) delete ret[path]
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

function parsePagination(query = {}, { defaultLimit = 20, maxLimit = 100 } = {}) {
    const rawPage = Number.parseInt(query.page, 10)
    const rawLimit = Number.parseInt(query.limit, 10)
    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
    let limit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : defaultLimit
    if (limit > maxLimit) limit = maxLimit
    return { page, limit, skip: (page - 1) * limit }
}

function buildMeta({ page, limit, total }) {
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0

    return {
        page, limit, total, totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    }
}

function escapeRegex(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseSort(sortParam, sortableFields = [], defaultSort = { createdAt: -1 }) {
    if (!sortParam || typeof sortParam !== 'string') return { ...defaultSort }
    const sort = {}
    for (const rawField of sortParam.split(',')) {
        const field = rawField.trim()
        if (!field) continue
        const descending = field.startsWith('-')
        const name = descending ? field.slice(1) : field
        if (!sortableFields.includes(name)) throw new Error(`Cannot sort by '${name}'`)
        sort[name] = descending ? -1 : 1
    }
    return Object.keys(sort).length > 0 ? sort : { ...defaultSort }
}

function buildFilter(query = {}, filterFields = {}, searchFields = []) {
    const filter = {}
    for (const [field, allowed] of Object.entries(filterFields)) {
        const value = query[field]
        if (value === undefined || value === '') continue
        if (!allowed.includes(value)) throw new Error(`'${value}' is not a supported ${field}`)
        filter[field] = value
    }

    if (query.q && searchFields.length > 0) {
        const pattern = new RegExp(escapeRegex(String(query.q).trim()), 'i')
        filter.$or = searchFields.map((field) => ({ [field]: pattern }))
    }

    return filter
}

function createRepository(Model, { writableFields, sortableFields = [], filterFields = {}, searchFields = [], defaultSort = { createdAt: -1 }, pagination = {} } = {}) {
    if (!Model) throw new Error('Model is required')
    if (!Array.isArray(writableFields)) throw new Error('writableFields is required')

    function pickWritable(body = {}) {
        const payload = {}
        for (const field of writableFields) if (body[field] !== undefined) payload[field] = body[field]
        return payload
    }

    const create = (data, extra = {}) => Model.create({ ...pickWritable(data), ...extra })
    const findById = async (id) => (mongoose.isValidObjectId(id) ? Model.findById(id) : null)
    const update = async (id, data) => mongoose.isValidObjectId(id) ? Model.findByIdAndUpdate(id, pickWritable(data), { new: true, runValidators: true }) : null
    const remove = async (id) => (mongoose.isValidObjectId(id) ? Model.findByIdAndDelete(id) : null)
    const count = (filter = {}) => Model.countDocuments(filter)

    async function list(query = {}, baseFilter = {}) {
        const filter = { ...buildFilter(query, filterFields, searchFields), ...baseFilter }
        const sort = parseSort(query.sort, sortableFields, defaultSort)
        const { page, limit, skip } = parsePagination(query, pagination)

        const [data, total] = await Promise.all([
            Model.find(filter).sort(sort).skip(skip).limit(limit),
            Model.countDocuments(filter)
        ])
        return { data, meta: buildMeta({ page, limit, total }) }
    }

    return { create, findById, list, update, remove, count }
}

module.exports = {
    connectDatabase,
    disconnectDatabase,
    isConnected,
    createSchema,
    defineModel,
    createRepository,
    parsePagination,
    parseSort,
    buildMeta,
    buildFilter,
    escapeRegex
}