# api-client

## What it does

A reusable fetch wrapper for calling a JSON API. It adds the base URL, a bearer token, JSON headers and a JSON body, parses the response, and throws a consistent `ApiError` when a request fails.

It has no dependency on any app: the base URL, the token source and even `fetch` itself are passed in.

## Install

No packages are required. It uses the built-in `fetch` available in modern browsers and Node 18 or later.

Copy the `api-client` folder into your project, and copy the `guard-kit` folder next to it. api-client imports `ApiError` from `../guard-kit`, so both folders must sit side by side.

## Usage

```js
const { createApiClient } = require('./api-client')

const client = createApiClient({
    baseUrl: 'https://api.example.com',
    getToken: () => localStorage.getItem('token')
})

async function main() {
    try {
        // Create a record
        await client.post('/items', { name: 'Notebook' })

        // Read records
        const items = await client.get('/items')
        console.log(items)

        // Update a record
        await client.put('/items/123', { name: 'Updated notebook' })

        // Delete a record
        await client.delete('/items/123')
    } catch (error) {
        console.log(error.statusCode, error.message)
    }
}

main()
```

Replace the base URL and routes with your own. The `getToken` option is optional; leave it out for public APIs.

## API

### `createApiClient(options)`

Creates a client with `get`, `post`, `put`, `patch` and `delete` methods.

- `options.baseUrl`: Text added to the start of every path. Defaults to `''`.
- `options.getToken`: Function that returns a token (or a promise of one). When it returns a value, the client sends `Authorization: Bearer <token>`.
- `options.headers`: Extra headers sent with every request.
- `options.fetchImpl`: Function to use instead of the global `fetch`.
- Throws an `ApiError` (400) if no `fetch` is available.

### Client methods

| Method | Description |
|---|---|
| `get(path)` | Sends a GET request. |
| `post(path, body)` | Sends a POST request with a JSON body. |
| `put(path, body)` | Sends a PUT request with a JSON body. |
| `patch(path, body)` | Sends a PATCH request with a JSON body. |
| `delete(path)` | Sends a DELETE request. |

Each method returns a promise containing the parsed response body, as received. A JSON response is parsed, a `204` response returns `null`, and any other content type is returned as text.

### Errors

Each method throws an `ApiError` from guard-kit when a request fails:

- A non-2xx response throws with `statusCode` set to the HTTP status, `message` taken from the response's `error.message` (or `message`) when present, and the parsed response body in `details`.
- A request that gets no response (for example, the network is offline) throws with `statusCode` set to `0`.

## Decisions

- Passed the base URL, token source and `fetch` in as options instead of reading them from the environment, so the module works unchanged in any project.
- Used a `getToken` function instead of reading storage directly, so projects can supply a token from any source, including a different storage or an async refresh.
- Returned the response body as received instead of unwrapping a `{ success, data }` envelope, so the client does not depend on how one server formats its responses.
- Threw `ApiError` from guard-kit so request failures match the error shape used by the other kits. This is the only dependency on another kit, and it is why `guard-kit` must be copied alongside this module.
- Used status `0` for requests that get no response, since there is no HTTP status to report.
- Accepted `fetchImpl` so tests can run without a network.

## Changes

- Created `createApiClient` with `get`, `post`, `put`, `patch` and `delete` methods.
- Added bearer-token, JSON header and JSON body handling.
- Added response parsing for JSON, text and empty responses.
- Added `ApiError` errors for failed responses and network failures.