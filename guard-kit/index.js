const {
    ApiError,
    requireFields,
    validateEmail,
    validateString
} = require('./guard-kit')

const userData = {
    name: 'Alex',
    email: 'alex@example.com'
}

requireFields(userData, ['name', 'email'])

validateString(userData.name, 'name', {
    minLength: 2,
    maxLength: 60
})

validateEmail(userData.email)