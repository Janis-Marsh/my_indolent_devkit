# auth-kit

## What it does

A reusable authentication module that provides password hashing, password comparison, JWT creation and verification, and token storage helpers.

It uses `bcryptjs` to securely hash passwords and `jsonwebtoken` to create and verify authentication tokens.

## Install

Install the required dependencies:

```bash
npm install bcryptjs jsonwebtoken
```

Copy the `auth-kit` folder into your project, and copy the `guard-kit` folder next to it. auth-kit imports `ApiError` from `../guard-kit`, so both folders must sit side by side.

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
- `options.saltRounds`: Number of salt rounds, an integer from 4 to 31. Defaults to `10`.
- Returns a promise containing the password hash.
- Rejects with an `ApiError` (400) if the password is not a string or is longer than 72 bytes.
- Rejects with an `ApiError` (400) if `saltRounds` is not an integer from 4 to 31.

### `comparePassword(plain, hash)`

Compares a plain-text password with an existing hash.

- `plain`: Password to check.
- `hash`: Stored password hash.
- Returns a promise containing a boolean.
- Returns `false` if either argument is missing or is not a string.
- Returns `false` if the password is longer than 72 bytes, because bcrypt would otherwise compare only the first 72 bytes.

### `needsRehash(hash, options)`

Checks whether a password hash uses fewer salt rounds than the configured value.

- `hash`: Existing bcrypt password hash.
- `options.saltRounds`: Desired salt rounds, an integer from 4 to 31. Defaults to `10`.
- Returns `true` if the hash needs to be updated.
- Throws an `ApiError` (400) if the hash is not a valid bcrypt hash.
- Throws an `ApiError` (400) if `saltRounds` is not an integer from 4 to 31.

### `signToken(payload, options)`

Creates a signed JWT.

- `payload`: Data to include in the token.
- `options.secret`: Required signing secret.
- `options.expiresIn`: Token expiration time. Defaults to `'7d'`.
- Returns the signed token.
- Throws an `ApiError` (400) if the secret is missing.

### `verifyToken(token, options)`

Verifies a JWT and returns its decoded payload.

- `token`: JWT to verify.
- `options.secret`: Required verification secret.
- Throws an `ApiError` (400) if the secret is missing.
- Throws an `ApiError` (401) if the token is invalid or expired.

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
- Made `hashPassword` async so every failure, including invalid input, reaches the caller as a rejected promise.
- Made `comparePassword` return `false` for passwords over 72 bytes instead of comparing them. bcrypt ignores bytes past 72, so without this check a long password would match a hash of only its first 72 bytes.
- Limited `saltRounds` to integers from 4 to 31, the range bcrypt accepts, so bad values fail with a clear error instead of an obscure one from the library.
- Used `jsonwebtoken` for signing and verifying JWTs.
- Set the default token expiration to seven days.
- Required the JWT secret to be passed into the functions instead of hardcoding it.
- Used a storage argument for token helpers instead of depending directly on browser storage. This allows different storage implementations to be used.
- Kept the functions independent so projects can import only the authentication features they need.
- Threw `ApiError` from guard-kit for invalid input and invalid tokens, so every kit reports errors in one consistent format. This is the only dependency on another kit, and it is why `guard-kit` must be copied alongside this module.
- Used a 400 error for missing secrets and bad input, and a 401 error for invalid or expired tokens, so callers can tell developer mistakes from failed authentication.

## Changes

- Created reusable password hashing and comparison functions.
- Added a function to check whether password hashes need to be updated.
- Added JWT signing and verification functions.
- Added reusable token storage, retrieval, and removal helpers.
- Exported all authentication functions from one module entry point.
- Refactored input and token errors to throw `ApiError` from guard-kit instead of generic errors.
- Added validation for `saltRounds` in `hashPassword` and `needsRehash`.
- Changed `comparePassword` to return `false` for non-string input and for passwords over 72 bytes.