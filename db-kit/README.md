# db-kit

## What it does

A reusable MongoDB module built with Mongoose. It provides database connection management, schema creation, model definition, and a repository with basic CRUD operations.

It also includes automatic timestamps, JSON formatting, and the option to hide sensitive fields when documents are converted to JSON.

## Install

Install the required dependency:

```bash
npm install mongoose
```

Copy the `db-kit` folder into your project, and copy the `guard-kit` folder next to it. db-kit imports `ApiError` from `../guard-kit`, so both folders must sit side by side.

## Usage

```js
const {
    connectDatabase,
    disconnectDatabase,
    isConnected,
    createSchema,
    defineModel,
    createRepository
} = require('./db-kit')

// Connect to MongoDB
await connectDatabase(process.env.MONGODB_URI)

// Check the database connection
console.log(isConnected())

// Create a schema
const userSchema = createSchema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    hidePaths: ['password']
})

// Define a model
const User = defineModel('User', userSchema)

// Create a repository
const userRepository = createRepository(User)

// Create a record
const user = await userRepository.create({
    name: 'Alex',
    email: 'alex@example.com',
    password: 'hashedPassword'
})

// Find records
const users = await userRepository.findAll()

// Find one record by ID
const foundUser = await userRepository.findById(user._id)

// Update a record
const updatedUser = await userRepository.update(user._id, {
    name: 'Alex Smith'
})

// Delete a record
await userRepository.remove(user._id)

// Disconnect from MongoDB
await disconnectDatabase()
```

## API

### `connectDatabase(uri)`

Connects to MongoDB.

- `uri`: MongoDB connection string.
- Enables Mongoose strict query mode.
- Attaches connection event listeners once.
- Uses a server selection timeout of 10 seconds.
- Throws an `ApiError` (400) if the URI is missing.
- Throws an `ApiError` (500) if the connection fails.

### `disconnectDatabase()`

Disconnects Mongoose from MongoDB.

- Returns a promise that resolves when the connection is closed.

### `isConnected()`

Checks whether Mongoose is currently connected.

- Returns `true` when the connection is active.
- Returns `false` otherwise.

### `createSchema(definition, options)`

Creates a new Mongoose schema.

- `definition`: Mongoose schema field definitions.
- `options.hidePaths`: Array of fields to remove from JSON output.
- Enables timestamps by default.
- Includes virtuals in JSON and object output.
- Removes `__v` from JSON output.
- Converts `_id` into `id` in JSON output.

Additional Mongoose schema options can be passed through the options object.

### `defineModel(name, schema)`

Creates or retrieves a Mongoose model.

- `name`: Model name.
- `schema`: Mongoose schema.
- Reuses an existing model with the same name to avoid model recompilation errors.

### `createRepository(Model)`

Creates a reusable repository containing five CRUD methods.

- `Model`: Mongoose model used by the repository.
- Throws an `ApiError` (400) if no model is provided.

Repository methods:

| Method | Description |
|---|---|
| `create(data)` | Creates a new document. |
| `findAll(filter = {})` | Finds documents matching a filter. |
| `findById(id)` | Finds a document by its MongoDB ID. |
| `update(id, data)` | Updates a document and returns the updated version. |
| `remove(id)` | Deletes a document and returns the deleted document. |

`findById`, `update`, and `remove` return `null` when the supplied ID is not a valid MongoDB ObjectId.

Updates run Mongoose validators.

## Decisions

- Used Mongoose to manage MongoDB connections, schemas, and models.
- Set `strictQuery` to `true` when connecting to the database.
- Used a 10-second server selection timeout to prevent connection attempts from waiting indefinitely.
- Attached connection event listeners only once to avoid duplicate logging.
- Enabled timestamps by default so documents automatically receive `createdAt` and `updatedAt` fields.
- Added `hidePaths` to allow projects to remove sensitive fields from JSON responses.
- Converted `_id` into `id` and removed `__v` when documents are converted to JSON.
- Reused existing Mongoose models to prevent model recompilation errors.
- Kept the repository separate from the model definition so the same CRUD methods can work with different models.
- Kept ownership and authorization rules outside the repository so each application can define its own access rules.

## Changes

- Added MongoDB connection and disconnection functions.
- Added a connection status check.
- Added a reusable schema creation function.
- Added a model definition function that checks for existing models.
- Added a repository factory with create, find, update, and delete operations.
- Added ObjectId validation before ID-based repository operations.
- Added JSON transformation options for timestamps, virtuals, and hidden fields.
- Refactored connection and repository errors to throw `ApiError` from guard-kit instead of generic errors.