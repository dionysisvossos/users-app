const mongoose = require('mongoose');
const request = require('supertest');

const authService = require('../services/auth.service');

const app = require('../app'); // Assuming your Express app is exported from app.js

require('dotenv').config();

// Connect to the test database before running tests
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    .then(
        () => {console.log("Connection to MongoDB established for Jest")},
        err => {console.log("Error connecting to MongoDB for Jest", err)}
    );
});

// Close the database connection after tests
afterEach(async () => {
    await mongoose.connection.close();
});

describe('Get requests for/api/users', () => {

    let token;

    beforeAll(() => {
        user = {
            username: 'admin',
            email: 'admin@aueb.gr',
            roles: ['EDITOR', 'READER', 'ADMIN'],
        };
        token = authService.generateAccessToken(user);
    })

    test('GET Returns all users', async () => {
        const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
    }, 30000);
});
