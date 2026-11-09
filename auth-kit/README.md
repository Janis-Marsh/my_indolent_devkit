# auth-kit

## What it does

A reusable authentication module that provides password hashing, password comparison, JWT creation and verification, and token storage helpers.

It uses `bcryptjs` to securely hash passwords and `jsonwebtoken` to create and verify authentication tokens.

## Install

Install the required dependencies:

```bash
npm install bcryptjs jsonwebtoken
```

Copy the `auth-kit` folder into your project and import the functions you need.

## Usage

```js
const {
    hashPassword,
    comparePassword,
    needsRehash,
    signToken,
    verifyToken,
    setToken,
    getToken,
    clearToken
} = require('./auth-kit')

// Hash a password
const hashedPassword = await hashPassword('myPassword123')

// Compare a password with its hash
const isMatch = await comparePassword('myPassword123', hashedPassword)

// Check whether a password needs to be rehashed
const rehashNeeded = needsRehash(hashedPassword)

// Create a JWT
const token = signToken(
    { userId: '123' },
    { secret: process.env.JWT_SECRET }
)

// Verify a JWT
const decoded = verifyToken(token, {
    secret: process.env.JWT_SECRET
})

// Store a token
setToken(storage, token)

// Retrieve a token
const savedToken = getToken(storage)

// Remove a token
clearToken(storage)
```

The `storage` argument must be an object that provides `setItem()`, `getItem()`, and `removeItem()` methods.

## API

### `hashPassword(plain, options)`

Hashes a plain-text password using bcrypt.

- `plain`: Password to hash.
- `options.saltRounds`: Number of salt rounds. Defaults to `10`.
- Rejects passwords longer than 72 bytes.
- Returns a promise containing the password hash.

### `comparePassword(plain, hash)`

Compares a plain-text password with an existing hash.

- `plain`: Password to check.
- `hash`: Stored password hash.
- Returns `false` if either argument is missing.
- Returns a promise containing a boolean.

### `needsRehash(hash, options)`

Checks whether a password hash uses fewer salt rounds than the configured value.

- `hash`: Existing bcrypt password hash.
- `options.saltRounds`: Desired salt rounds. Defaults to `10`.
- Returns `true` if the hash needs to be updated.

### `signToken(payload, options)`

Creates a signed JWT.

- `payload`: Data to include in the token.
- `options.secret`: Required signing secret.
- `options.expiresIn`: Token expiration time. Defaults to `'7d'`.
- Returns the signed token.
- Throws an error if the secret is missing.

### `verifyToken(token, options)`

Verifies a JWT and returns its decoded payload.

- `token`: JWT to verify.
- `options.secret`: Required verification secret.
- Throws an error if the secret is missing or the token is invalid.

### `setToken(storage, token, key)`

Stores a token using the provided storage object.

- `storage`: Object with a `setItem()` method.
- `token`: Token to store.
- `key`: Storage key. Defaults to `'token'`.

### `getToken(storage, key)`

Retrieves a stored token.

- `storage`: Object with a `getItem()` method.
- `key`: Storage key. Defaults to `'token'`.

### `clearToken(storage, key)`

Removes a stored token.

- `storage`: Object with a `removeItem()` method.
- `key`: Storage key. Defaults to `'token'`.

## Decisions

- Used `bcryptjs` for password hashing and comparison.
- Set the default salt rounds to `10`.
- Reject passwords longer than 72 bytes to avoid bcrypt's password-length limitation.
- Used `jsonwebtoken` for signing and verifying JWTs.
- Set the default token expiration to seven days.
- Required the JWT secret to be passed into the functions instead of hardcoding it.
- Used a storage argument for token helpers instead of depending directly on browser storage. This allows different storage implementations to be used.
- Kept the functions independent so projects can import only the authentication features they need.

## Changes

- Created reusable password hashing and comparison functions.
- Added a function to check whether password hashes need to be updated.
- Added JWT signing and verification functions.
- Added reusable token storage, retrieval, and removal helpers.
- Exported all authentication functions from one module entry point.
