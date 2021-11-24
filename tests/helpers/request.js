const supertest = require('supertest')
const app = require('../../src/app')

module.exports = function makeRequest({
    method,
    path,
    user = null,
    payload = null,
}) {
    return async function request(body) {
        const request = supertest(app)[method](path)
        if (user) {
            const accessToken = await user.generateAuthToken()
            request.set('Authorization', `Bearer ${accessToken}`)
        }
        if (payload) {
            return request.send(payload)
        }
        return request.send(body)
    }
}
