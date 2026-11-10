'use strict'

const { ApiError } = require('../guard-kit')

function createApiClient({ baseUrl = '', getToken, headers = {}, fetchImpl } = {}) {
    const doFetch = fetchImpl || globalThis.fetch

    if (typeof doFetch !== 'function') {
        throw new ApiError.badRequest('fetch is not available; pass fetchImpl')
    }

    async function request(method, path, body) {
        const token = getToken ? await getToken() : null

        const requestHeaders = {
            Accept: 'application/json',
            ...(body !== undefined && { 'Content-Type': 'application/json' }),
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers
        }

        let response

        try {
            response = await doFetch(`${baseUrl}${path}`, {
                method,
                headers: requestHeaders,
                ...(body !== undefined && { body: JSON.stringify(body) })
            })
        } catch (error) {
            throw new ApiError(0, `Network error: ${error.message}`)
        }

        let data = null

        if (response.status !== 204) {
            const type = response.headers.get('content-type') || ''
            try {
                data = type.includes('application/json')
                    ? await response.json()
                    : await response.text()
            } catch (error) {
                data = null
            }
        }

        if (!response.ok) {
            const message =
                data?.error?.message ||
                data?.message ||
                `Request failed with status ${response.status}`

            throw new ApiError(response.status, message, data)
        }

        return data
    }

    return {
        get: (path) => request('GET', path),
        post: (path, body) => request('POST', path, body ?? {}),
        put: (path, body) => request('PUT', path, body ?? {}),
        patch: (path, body) => request('PATCH', path, body ?? {}),
        delete: (path) => request('DELETE', path)
    }
}

module.exports = { createApiClient }