import { User } from '../builder/UserBuilder';
import { Product } from '../builder/ProductBuilder';

/**
 * IDatabaseManager Interface
 * 
 * Defines the contract for database operations.
 * This allows for multiple implementations (MySQL, Mock, etc.)
 */
export interface IDatabaseManager {
    /**
     * Test database connection
     */
    testConnection(): Promise<boolean>;

    /**
     * Save a user to the database
     */
    saveUser(user: User): Promise<void>;

    /**
     * Get a user from the database
     */
    getUser(username: string): Promise<User | undefined>;

    /**
     * Get all users from the database
     */
    getAllUsers(): Promise<User[]>;

    /**
     * Delete a user from the database
     */
    deleteUser(username: string): Promise<boolean>;

    /**
     * Save a product to the database
     */
    saveProduct(product: Product): Promise<void>;

    /**
     * Get a product from the database
     */
    getProduct(name: string): Promise<Product | undefined>;

    /**
     * Get all products from the database
     */
    getAllProducts(): Promise<Product[]>;

    /**
     * Delete a product from the database
     */
    deleteProduct(name: string): Promise<boolean>;

    /**
     * Save test data
     */
    saveTestData(key: string, value: any): Promise<void>;

    /**
     * Get test data
     */
    getTestData(key: string): Promise<any | undefined>;

    /**
     * Clear all data from the database
     */
    clearAll(): Promise<void>;

    /**
     * Get database statistics
     */
    getStats(): Promise<{
        userCount: number;
        productCount: number;
        testDataCount: number;
    }>;

    /**
     * Close database connections
     */
    close(): Promise<void>;
}
