const request = require('supertest');
const app = require('../index');

describe('Load Shedding Schedule API', () => {
    it('should return a 200 status code for fetching 7 days schedule for a specific suburb using the sid', async () => {
        await request(app).get('/schedule?id=aintree-14-a-kwa-zulu-natal').then(res => {
            expect(res.statusCode).toBe(200);
        })
    });
});