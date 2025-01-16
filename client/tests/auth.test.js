const  login  = require('../functions/auth');


describe('User Authentication Module', () => {
    test('should allow valid user login', () => {
        const users = [{ username: 'testUser', password: 'password123' }];
        const response = login('testUser', 'password123', users);
        expect(response.success).toBe(true);
        expect(response.message).toBe('Login successful');
    });

    test('should reject login for non-existent user', () => {
        const users = [{ username: 'testUser', password: 'password123' }];
        const response = login('unknownUser', 'password123', users);
        expect(response.success).toBe(false);
        expect(response.message).toBe('User not found');
    });
});


