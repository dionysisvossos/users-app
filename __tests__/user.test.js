const mongoose = require('mongoose');
const request = require('supertest');

const authService = require('../services/auth.service');
const userService = require('../services/user.services');

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

    it('GET Returns all users', async () => {
        const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBeTruthy();
    expect(res.body.data.length).toBeGreaterThan(0);
    }, 50000);

    it('POST Creates a new user', async () => {
        const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
            'username': 'test5',
            'password': '12345',
            'name': 'Test5 name',
            'surname': 'Test5 surname',
            'email': 'test5@aueb.gr',
            'address': {
                'area': 'area5',
                'road': 'road5'
            }
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    }, 50000);

    it('POST creates a user that already exists', async () => {
        const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
            username: 'test5',
            password: '12345',
            name: 'new name',
            surname: 'new surname',
            email: 'new@aueb.gr',
            address: {
                area: 'new area',
                road: 'new road'
            }
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    }, 50000);

    it('POST creates a user with same email', async () => {
        const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
            username: 'test6',
            password: '12345',
            name: 'name6',
            surname: 'surname6',
            email: 'test5@aueb.gr',
            address: {
                area: 'area6',
                road: 'road6'
            }
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    }, 50000);

    it('POST creates a user with empty name, surname, password', async () => {
        const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
            username: 'test6',
            password: '',
            name: '',
            surname: '',
            email: 'test6@aueb.gr',
            address: {
                area: 'area6',
                road: 'road6'
            }
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.status).not.toBeTruthy();
    })
});


describe("Requests for /api/users/:username", () => {
    let token;
    
    beforeAll(() => {
        user = {
            username: 'admin',
            email: 'admin@aueb.gr',
            roles: ['EDITOR', 'READER', 'ADMIN'],
        };
        token = authService.generateAccessToken(user);
    });

    it('GET Returns user with specific username', async () => {

        const result = await userService.findLastInsertedUser();
        console.log('RESULT>>', result);

        const res = await request(app)
        .get('/api/users/' + result.username)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
        expect(res.body.data.username).toBe(result.username);
        expect(res.body.data.email).toBe(result.email);
    }, 30000);

    it('PATCH Updates a user', async () => {
        const result = await userService.findLastInsertedUser();

        const res = await request(app)
        .patch('/api/users/' + result.username)
        .set('Authorization', `Bearer ${token}`)
        .send({
            username: result.username,
            name: 'New Updated name',
            surname: 'New Updated surname',
            email: result.email,
            address: {
                area: 'new area',
                road: result.address.road
            }
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    })

    it('DELETE Deletes a user', async () => {
        const result = await userService.findLastInsertedUser();

        const res = await request(app)
        .delete('/api/users/' + result.username)
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBeTruthy();
    }, 30000);
});
