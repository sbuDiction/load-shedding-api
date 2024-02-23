const request = require('supertest');
const app = require('../index');

describe('Suburbs Search API', () => {
    it('should return success status code 200 for search endpoint', async () => {
        await request(app).get('/search?text=osizweni').then(res => {
            expect(res.statusCode).toBe(200);
        })
    });
});