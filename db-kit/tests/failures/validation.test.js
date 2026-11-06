'use strict'

const db = require('../../index')

test('connectDatabase rejects when the MongoDB URI is missing', async () => {
    await expect(db.connectDatabase()).rejects.toThrow(
        'MongoDB URI is required'
    )
})

test('createRepository throws when no model is provided', () => {
    expect(() => db.createRepository()).toThrow(
        'Model is required'
    )
})

test('findById returns null for an invalid ID', async () => {
    const repository = db.createRepository({
        findById: jest.fn()
    })

    await expect(repository.findById('invalid-id')).resolves.toBeNull()
})

test('update returns null for an invalid ID', async () => {
    const repository = db.createRepository({
        findByIdAndUpdate: jest.fn()
    })

    await expect(
        repository.update('invalid-id', { title: 'Updated' })
    ).resolves.toBeNull()
})

test('remove returns null for an invalid ID', async () => {
    const repository = db.createRepository({
        findByIdAndDelete: jest.fn()
    })

    await expect(repository.remove('invalid-id')).resolves.toBeNull()
})
