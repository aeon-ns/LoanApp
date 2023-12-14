const request = require('supertest');
const app = require('../../index');

describe('Loan APIs End-to-End Test(s)', () => {
    let userToken, adminToken, loanId;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post('/users/login')
            .send({ username: 'customer', password: 'customer' });
        const adminLoginResponse = await request(app)
            .post('/users/login')
            .send({ username: 'admin', password: 'admin' });
        userToken = loginResponse.body.token;
        adminToken = adminLoginResponse.body.token;
    });

    it('should create a loan for the user', async () => {
        const loanData = {
            amount: 1000,
            term: 10,
        };

        const response = await request(app)
            .post('/loans')
            .set('Authorization', userToken)
            .send(loanData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.amount).toBe(loanData.amount);
        expect(response.body.term).toBe(loanData.term);
        expect(response.body.state).toBe('PENDING');

        loanId = response.body.id;
    });

    it('should return an error for invalid loan data', async () => {
        const invalidLoanData = {
            amount: -100, // Invalid amount
            term: 6,
        };

        const response = await request(app)
            .post('/loans')
            .set('Authorization', userToken)
            .send(invalidLoanData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });


    it('should get all loans of the user', async () => {
        // Create a loan first (you can modify this based on your actual test data)
        const loanData = {
            amount: 1000,
            term: 12,
        };

        const createLoanResponse = await request(app)
            .post('/loans')
            .set('Authorization', userToken)
            .send(loanData);

        expect(createLoanResponse.status).toBe(201);

        // Get all loans for the user
        const response = await request(app)
            .get('/loans')
            .set('Authorization', userToken);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0].user_id).toBeGreaterThan(0); // Ensure it's associated with the correct user
    });

    it('should not allow non-admin to approve a loan', async () => {
        const response = await request(app)
            .post('/loans/approve')
            .set('Authorization', userToken)
            .send({ loanId });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error');
    });

    it('should allow admin to approve a loan', async () => {
        const response = await request(app)
            .post('/loans/approve')
            .set('Authorization', adminToken)
            .send({ loanId });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('state', 'APPROVED');
    });

    it('should add a repayment for the user', async () => {
        const repaymentData = {
            loanId: loanId,
            amount: 200,
        };

        const response = await request(app)
            .post('/loans/repayment')
            .set('Authorization', userToken)
            .send(repaymentData);
        
        console.log('Response: ', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Repayment(s) added successfully');
    });

    it('should return an error for invalid repayment data', async () => {
        const invalidRepaymentData = {
            loanId: loanId,
            amount: -50, // Invalid amount
        };

        const response = await request(app)
            .post('/loans/repayment')
            .set('Authorization', userToken)
            .send(invalidRepaymentData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });


});