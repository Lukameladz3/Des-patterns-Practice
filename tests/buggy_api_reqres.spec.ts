import { test, expect } from '@playwright/test';
import { ReqresApiClient } from '../src/patterns/singleton/ReqresApiClient';
import { ReqresUserBuilder } from '../src/patterns/builder/ReqresUserBuilder';

test.describe('Reqres.in API Tests', () => {
    let apiClient: ReqresApiClient;

    test.beforeAll(() => {
        apiClient = ReqresApiClient.getInstance();
    });

    test('GET Users - should list users', async () => {
        const response = await apiClient.getUsers(2);
        
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.page).toBe(2);
        expect(Array.isArray(body.data)).toBeTruthy();
        expect(body.data.length).toBeGreaterThan(0);
        
    });

    test('POST User - should create a new user using Builder pattern', async () => {
        const userData = new ReqresUserBuilder()
            .withName('George')
            .withJob('Senior Developer')
            .build();

        const response = await apiClient.createUser(userData);
        
        expect(response.status()).toBe(201);
        
        const body = await response.json();
        expect(body.name).toBe(userData.name);
        expect(body.job).toBe(userData.job);
        expect(body.id).toBeDefined();
        
    });

    test('PUT User - should update user information', async () => {
        const updateData = {
            job: 'Lead Developer'
        };

        const response = await apiClient.updateUser('2', updateData);
        
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body.job).toBe(updateData.job);
        expect(body.updatedAt).toBeDefined();
        
    });

    test('DELETE User - should delete user', async () => {
        const response = await apiClient.deleteUser('2');
        
        expect(response.status()).toBe(204);
        
    });
});
