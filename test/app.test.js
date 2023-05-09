const request  = require('supertest')
const app = require('../app')

describe('Basic app routes', () => {
    it('should give 200 statusCode on succeful request', async () => {
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toEqual(expect.stringContaining('html'))
    })

    it.skip('should throw error if route not registered', async () => {
        const response = await request(app).get('/unknown-route')
        console.log(response);
        expect(response.statusCode).toBe(404)
    })
})