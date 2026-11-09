# guard-kit

## What it does

A reusable error-handling and validation module for Express applications.

It provides standardized API errors, a global error handler, and validation helpers for checking required fields, email addresses, and string values.

The module helps applications handle errors consistently without repeating validation and error-handling logic throughout their code.

## Install

No additional dependencies are required for the current implementation.

Copy the `guard-kit` folder into your project and import the functions you need.

## Usage

```js
'use strict'

const express = require('express')

const {
    ApiError,
    errorHandler,
    requireFields,
    validateEmail,
    validateString
} = require('./guard-kit')

const app = express()

app.use(express.json())

app.post('/users', (req, res, next) => {
    try {
        // Check required fields
        requireFields(req.body, ['name', 'email'])

        // Validate individual fields
        const name = validateString(req.body.name, 'name', {
            minLength: 2,
            maxLength: 60
        })

        const email = validateEmail(req.body.email)

        return res.status(201).json({
            success: true,
            data: { name, email }
        })
    } catch (error) {
        next(error)
    }
})

// Handle errors after routes
app.use(errorHandler)

app.listen(3000)
```

## API

### `ApiError`

Creates standardized errors with HTTP status codes.

Constructor:

`new ApiError(statusCode, message, details = null)`

Static methods:

| Method | Status code | Purpose |
|---|---:|---|
| `ApiError.badRequest()` | 400 | Invalid request data |
| `ApiError.unauthorized()` | 401 | Authentication is required or invalid |
| `ApiError.forbidden()` | 403 | User does not have permission |
| `ApiError.notFound()` | 404 | Requested resource does not exist |
| `ApiError.conflict()` | 409 | Request conflicts with existing data |

Each method accepts an optional message and details object.

### `errorHandler(err, req, res, next)`

Global Express error-handling middleware.

- Uses the error's status code when available.
- Handles Mongoose CastErrors.
- Handles Mongoose ValidationErrors.
- Handles MongoDB duplicate-key errors.
- Handles malformed JSON request bodies.
- Handles oversized request bodies.
- Logs server errors.
- Includes stack traces for server errors outside production.
- Returns a consistent JSON error response.

### `requireFields(data, fields)`

Checks that required fields are present in an object.

- `data`: Object containing the incoming data.
- `fields`: Array of required field names.
- Throws a 400 error when the data is invalid or required fields are missing.
- Returns the original data when validation succeeds.

### `validateEmail(email)`

Checks whether an email address matches the module's basic email format.

- `email`: Email address to validate.
- Throws a 400 error when the value is not a valid string or does not match the email pattern.
- Returns the email when validation succeeds.

### `validateString(value, field, options)`

Validates a string's type and length.

- `value`: String to validate.
- `field`: Field name used in error messages.
- `options.minLength`: Minimum allowed length. Defaults to `1`.
- `options.maxLength`: Maximum allowed length. Defaults to unlimited.
- Trims whitespace before checking the length.
- Returns the trimmed string when validation succeeds.
- Throws a 400 error when validation fails.

## Decisions

- Used a custom `ApiError` class to keep application errors consistent and identifiable.
- Used static error methods so controllers can create errors without manually specifying status codes.
- Separated authentication errors (401) from permission errors (403).
- Included error details so validation failures can identify which fields need attention.
- Used one global error handler instead of repeating error-response logic across routes.
- Handled common Mongoose and Express errors without importing those packages directly.
- Used `process.env.NODE_ENV` to determine whether stack traces should be included in responses.
- Kept validation helpers independent of any specific model or application.
- Used simple validation functions rather than requiring an external validation library.

## Changes

- Added the `ApiError` class with standardized HTTP error methods.
- Added `badRequest`, `unauthorized`, `forbidden`, `notFound`, and `conflict` shortcuts.
- Added global Express error-handling middleware.
- Added handling for Mongoose validation, CastErrors, and duplicate-key errors.
- Added handling for malformed JSON and oversized request bodies.
- Added `requireFields` for required-field validation.
- Added `validateEmail` for email format validation.
- Added `validateString` for string type and length validation.
- Exported all functionality from one `index.js` file.