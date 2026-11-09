# api-kit

## What it does

A reusable Express API module that provides common route handling and response formatting.

It includes an asynchronous error handler, consistent success responses, a no-content response, and a CRUD router that connects Express routes to an injected repository.

## Install

Install the required dependency:

```bash
npm install express
```

Copy the `api-kit` folder into your project and import the functions you need.

## Usage

```js
'use strict'

const express = require('express')
const {
    asyncHandler,
    sendSuccess,
    sendCreate,
    sendNoContent,
    createCrudRouter
} = require('./api-kit')

const app = express()

app.use(express.json())

// Example repository
const repository = {
    findAll: async (filter) => [],
    findById: async (id) => null,
    create: async (data) => data,
    update: async (id, data) => data,
    remove: async (id) => ({ id })
}

// Mount the CRUD routes
app.use('/api/items', createCrudRouter(repository))

// Example custom route
app.get('/api/status', asyncHandler(async (req, res) => {
    return sendSuccess(res, { message: 'API is running' })
}))

// Error handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message
    })
})

app.listen(3000)
```

The repository must provide `findAll`, `findById`, `create`, `update`, and `remove` methods. The example repository above is only a placeholder; replace it with your application's actual repository.

## API

### `asyncHandler(fn)`

Wraps an asynchronous Express route handler and forwards rejected promises to Express error-handling middleware.

- `fn`: Express route handler.
- Calls `next(error)` when the handler throws or returns a rejected promise.

### `sendSuccess(res, data, statusCode = 200, extra = {})`

Sends a standardized JSON success response.

- `res`: Express response object.
- `data`: Response data.
- `statusCode`: HTTP status code. Defaults to `200`.
- `extra`: Additional response properties.

Response format:

```json
{
    "success": true,
    "data": {}
}
```

### `sendCreate(res, data)`

Sends a successful creation response.

- `res`: Express response object.
- `data`: Newly created resource.
- Uses HTTP status `201`.

### `sendNoContent(res)`

Sends a response with HTTP status `204`.

- `res`: Express response object.
- Sends no response body.

### `createCrudRouter(repository)`

Creates an Express router with five CRUD endpoints.

- `repository`: Object containing the required CRUD methods.

| Method | Route | Repository method | Response |
|---|---|---|---|
| GET | `/` | `findAll(req.query)` | 200 |
| POST | `/` | `create(req.body)` | 201 |
| GET | `/:id` | `findById(req.params.id)` | 200 |
| PUT | `/:id` | `update(req.params.id, req.body)` | 200 |
| DELETE | `/:id` | `remove(req.params.id)` | 204 |

If a requested record cannot be found, the router forwards a `404` error with the message `Record not found` to Express error-handling middleware.

## Decisions

- Used Express Router to create reusable CRUD routes that can be mounted at different paths.
- Used `asyncHandler` to forward asynchronous errors to Express instead of repeating try/catch blocks in every route.
- Used a consistent success response format with `success` and `data` properties.
- Used HTTP status `201` for successful resource creation and `204` for successful deletion.
- Used HTTP status `404` when a requested record does not exist.
- Kept error response formatting in the application's error-handling middleware so each application can decide how to format errors.

## Changes

- Added `asyncHandler` for asynchronous Express route handling.
- Added `sendSuccess` for standardized JSON responses.
- Added `sendCreate` for resource creation responses.
- Added `sendNoContent` for deletion responses.
- Added `createCrudRouter` with GET, POST, PUT, and DELETE routes.
- Added missing-record checks for find, update, and delete operations.