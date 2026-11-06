'use strict'

require('dotenv').config({ quiet: true })

const mongoose = require('mongoose')
const db = require('../../index')

const MONGODB_URI = process.env.MONGODB_URI

if (MONGODB_URI) {
    beforeAll(async () => {
        await db.connectDatabase(MONGODB_URI)
    })

    afterAll(async () => {
        if (db.isConnected()) {
            await db.disconnectDatabase()
        }
    })

    test('connectDatabase connects to MongoDB successfully', async () => {
        expect(db.isConnected()).toBe(true)

        const ping = await mongoose.connection.db.admin().ping()

        expect(ping.ok).toBe(1)
    })

    test('disconnectDatabase closes the connection', async () => {
        await db.disconnectDatabase()

        expect(db.isConnected()).toBe(false)
    })
} else {
    test.skip('MongoDB connection tests require MONGODB_URI', () => {})
}
