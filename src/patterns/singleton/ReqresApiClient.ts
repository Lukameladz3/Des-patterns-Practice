import { APIRequestContext, request } from '@playwright/test';
import { ReqresUser } from '../builder/ReqresUserBuilder';

/**
 * Singleton Pattern - Reqres API Client
 * 
 * Purpose: Provides a single instance to interact with the Reqres API.
 */
export class ReqresApiClient {
    private static instance: ReqresApiClient;
    private baseUrl: string = 'https://reqres.in';



    public static getInstance(): ReqresApiClient {
        if (!ReqresApiClient.instance) {
            ReqresApiClient.instance = new ReqresApiClient();
        }
        return ReqresApiClient.instance;
    }

    /**
     * Helper to get a fresh request context
     */
    private async getContext(): Promise<APIRequestContext> {
        return await request.newContext({
            baseURL: this.baseUrl,
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
    }

    public async getUsers(page: number = 1) {
        const context = await this.getContext();
        const response = await context.get(`/api/users?page=${page}`);
        return response;
    }

    public async createUser(user: ReqresUser) {
        const context = await this.getContext();
        const response = await context.post('/api/users', {
            data: user
        });
        return response;
    }

    public async updateUser(id: string, user: Partial<ReqresUser>) {
        const context = await this.getContext();
        const response = await context.put(`/api/users/${id}`, {
            data: user
        });
        return response;
    }

    public async deleteUser(id: string) {
        const context = await this.getContext();
        const response = await context.delete(`/api/users/${id}`);
        return response;
    }
}
