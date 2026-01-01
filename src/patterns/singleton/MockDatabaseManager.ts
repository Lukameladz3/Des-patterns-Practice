import { User } from '../builder/UserBuilder';
import { Product } from '../builder/ProductBuilder';
import { IDatabaseManager } from './IDatabaseManager';

/**
 * MockDatabaseManager - In-Memory Mock Implementation
 * 
 * Provides a lightweight, in-memory database for testing without MySQL dependency.
 * Perfect for CI/CD environments where database setup is impractical.
 * 
 * Features:
 * - Uses JavaScript Maps for fast in-memory storage
 * - No external dependencies
 * - Data clears automatically on process restart
 * - Implements same interface as real DatabaseManager
 */
export class MockDatabaseManager implements IDatabaseManager {
    private static instance: MockDatabaseManager;
    
    // In-memory storage
    private users: Map<string, User>;
    private products: Map<string, Product>;
    private testData: Map<string, any>;
    
    /**
     * Private constructor for Singleton pattern
     */
    private constructor() {
        this.users = new Map();
        this.products = new Map();
        this.testData = new Map();
    }
    
    /**
     * Get singleton instance
     */
    public static getInstance(): MockDatabaseManager {
        if (!MockDatabaseManager.instance) {
            MockDatabaseManager.instance = new MockDatabaseManager();
        }
        return MockDatabaseManager.instance;
    }
    
    /**
     * Test connection (always succeeds for mock)
     */
    public async testConnection(): Promise<boolean> {
        return true;
    }
    
    /**
     * Save user to in-memory storage
     */
    public async saveUser(user: User): Promise<void> {
        this.users.set(user.username, { ...user });
    }
    
    /**
     * Get user from in-memory storage
     */
    public async getUser(username: string): Promise<User | undefined> {
        const user = this.users.get(username);
        return user ? { ...user } : undefined;
    }
    
    /**
     * Get all users
     */
    public async getAllUsers(): Promise<User[]> {
        return Array.from(this.users.values()).map(user => ({ ...user }));
    }
    
    /**
     * Delete user
     */
    public async deleteUser(username: string): Promise<boolean> {
        return this.users.delete(username);
    }
    
    /**
     * Save product to in-memory storage
     */
    public async saveProduct(product: Product): Promise<void> {
        this.products.set(product.name, { ...product });
    }
    
    /**
     * Get product from in-memory storage
     */
    public async getProduct(name: string): Promise<Product | undefined> {
        const product = this.products.get(name);
        return product ? { ...product } : undefined;
    }
    
    /**
     * Get all products
     */
    public async getAllProducts(): Promise<Product[]> {
        return Array.from(this.products.values()).map(product => ({ ...product }));
    }
    
    /**
     * Delete product
     */
    public async deleteProduct(name: string): Promise<boolean> {
        return this.products.delete(name);
    }
    
    /**
     * Save test data
     */
    public async saveTestData(key: string, value: any): Promise<void> {
        this.testData.set(key, value);
    }
    
    /**
     * Get test data
     */
    public async getTestData(key: string): Promise<any | undefined> {
        return this.testData.get(key);
    }
    
    /**
     * Clear all data
     */
    public async clearAll(): Promise<void> {
        this.users.clear();
        this.products.clear();
        this.testData.clear();
    }
    
    /**
     * Get statistics
     */
    public async getStats(): Promise<{
        userCount: number;
        productCount: number;
        testDataCount: number;
    }> {
        return {
            userCount: this.users.size,
            productCount: this.products.size,
            testDataCount: this.testData.size
        };
    }
    
    /**
     * Close connections (no-op for mock)
     */
    public async closeConnection(): Promise<void> {
        // No connections to close for mock
    }
    
    // Alias for backward compatibility
    public async close(): Promise<void> {
        return this.closeConnection();
    }
}
