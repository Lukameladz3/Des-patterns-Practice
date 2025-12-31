import mysql from 'mysql2/promise';
import { User } from '../builder/UserBuilder';
import { Product } from '../builder/ProductBuilder';

/**
 * DatabaseManager - Singleton Pattern Implementation with MySQL
 * 
 * A practical singleton for managing test data storage in MySQL database.
 * This demonstrates a real-world use case where you need a single,
 * shared database connection pool across your test suite.
 * 
 * Use cases:
 * - Store test data in persistent MySQL database
 * - Maintain test user credentials across test runs
 * - Track created test data for cleanup
 * - Share state between test steps
 */
export class DatabaseManager {
    private static instance: DatabaseManager;
    
    // MySQL connection pool
    private pool: mysql.Pool;
    
    /**
     * Private constructor prevents direct instantiation
     */
    private constructor() {
        
        // Create MySQL connection pool
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    /**
     * Get the singleton instance
     */
    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        } 
        return DatabaseManager.instance;
    }

    public verifyInstanceIsSingleton(instance1: DatabaseManager, instance2: DatabaseManager) {
        return instance1 === instance2;
    }

    /**
     * Test database connection
     */
    public async testConnection(): Promise<boolean> {
        try {
            const connection = await this.pool.getConnection();
            await connection.ping();
            connection.release();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Save a user to the database
     */
    public async saveUser(user: User): Promise<void> {
        const query = `
            INSERT INTO users (username, password, email) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                password = VALUES(password), 
                email = VALUES(email)
        `;
        
        try {
            await this.pool.execute(query, [user.username, user.password, user.email || null]);
        } catch (error) {
            console.error(`  ✗ Failed to save user: ${error}`);
            throw error;
        }
    }

    /**
     * Get a user from the database
     */
    public async getUser(username: string): Promise<User | undefined> {
        const query = 'SELECT * FROM users WHERE username = ?';
        
        try {
            const [rows] = await this.pool.execute(query, [username]);
            const users = rows as any[];
            
            if (users.length > 0) {
                return {
                    username: users[0].username,
                    password: users[0].password,
                    email: users[0].email
                };
            } else {
                return undefined;
            }
        } catch (error) {
            console.error(`  ✗ Failed to get user: ${error}`);
            throw error;
        }
    }

    /**
     * Get all users
     */
    public async getAllUsers(): Promise<User[]> {
        const query = 'SELECT * FROM users';
        
        try {
            const [rows] = await this.pool.execute(query);
            const users = rows as any[];
            
            return users.map(row => ({
                username: row.username,
                password: row.password,
                email: row.email
            }));
        } catch (error) {
            console.error(`  ✗ Failed to get all users: ${error}`);
            throw error;
        }
    }

    /**
     * Save a product to the database
     */
    public async saveProduct(product: Product): Promise<void> {
        const query = `
            INSERT INTO products (name, price, category, description) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                price = VALUES(price), 
                category = VALUES(category),
                description = VALUES(description)
        `;
        
        try {
            await this.pool.execute(query, [
                product.name,
                product.price || null,
                product.category || null,
                product.description || null
            ]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get a product from the database
     */
    public async getProduct(name: string): Promise<Product | undefined> {
        const query = 'SELECT * FROM products WHERE name = ?';
        
        try {
            const [rows] = await this.pool.execute(query, [name]);
            const products = rows as any[];
            
            if (products.length > 0) {
                return {
                    name: products[0].name,
                    price: products[0].price,
                    category: products[0].category,
                    description: products[0].description
                };
            } else {
                return undefined;
            }
        } catch (error) {
            console.error(`  ✗ Failed to get product: ${error}`);
            throw error;
        }
    }

    /**
     * Get all products
     */
    public async getAllProducts(): Promise<Product[]> {
        const query = 'SELECT * FROM products';
        
        try {
            const [rows] = await this.pool.execute(query);
            const products = rows as any[];
            
            return products.map(row => ({
                name: row.name,
                price: row.price,
                category: row.category,
                description: row.description
            }));
        } catch (error) {
            console.error(`  ✗ Failed to get all products: ${error}`);
            throw error;
        }
    }

    /**
     * Save arbitrary test data
     */
    public async saveTestData(key: string, value: any): Promise<void> {
        const query = `
            INSERT INTO test_data (key_name, value) 
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE value = VALUES(value)
        `;
        
        const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        
        try {
            await this.pool.execute(query, [key, valueStr]);
        } catch (error) {
            console.error(`  ✗ Failed to save test data: ${error}`);
            throw error;
        }
    }

    /**
     * Get arbitrary test data
     */
    public async getTestData(key: string): Promise<any> {
        const query = 'SELECT value FROM test_data WHERE key_name = ?';
        
        try {
            const [rows] = await this.pool.execute(query, [key]);
            const data = rows as any[];
            
            if (data.length > 0) {
                const value = data[0].value;
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            }
            return undefined;
        } catch (error) {
            console.error(`  ✗ Failed to get test data: ${error}`);
            throw error;
        }
    }

    /**
     * Clear all data (useful for test cleanup)
     */
    public async clearAll(): Promise<void> {
        try {
            await this.pool.execute('DELETE FROM users');
            await this.pool.execute('DELETE FROM products');
            await this.pool.execute('DELETE FROM test_data');
        } catch (error) {
            console.error(`  ✗ Failed to clear all data: ${error}`);
            throw error;
        }
    }

    /**
     * Clear only users
     */
    public async clearUsers(): Promise<void> {
        try {
            await this.pool.execute('DELETE FROM users');
        } catch (error) {
            console.error(`  ✗ Failed to clear users: ${error}`);
            throw error;
        }
    }

    /**
     * Clear only products
     */
    public async clearProducts(): Promise<void> {
        try {
            await this.pool.execute('DELETE FROM products');
        } catch (error) {
            console.error(`  ✗ Failed to clear products: ${error}`);
            throw error;
        }
    }

    /**
     * Get database statistics
     */
    public async getStats(): Promise<{ users: number; products: number; testData: number }> {
        try {
            const [userRows] = await this.pool.execute('SELECT COUNT(*) as count FROM users');
            const [productRows] = await this.pool.execute('SELECT COUNT(*) as count FROM products');
            const [testDataRows] = await this.pool.execute('SELECT COUNT(*) as count FROM test_data');
            
            const users = (userRows as any[])[0].count;
            const products = (productRows as any[])[0].count;
            const testData = (testDataRows as any[])[0].count;
            
            return { users, products, testData };
        } catch (error) {
            console.error(`  ✗ Failed to get stats: ${error}`);
            throw error;
        }
    }

    /**
     * Check if user exists
     */
    public async hasUser(username: string): Promise<boolean> {
        const query = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
        
        try {
            const [rows] = await this.pool.execute(query, [username]);
            return (rows as any[])[0].count > 0;
        } catch (error) {
            console.error(`  ✗ Failed to check user existence: ${error}`);
            throw error;
        }
    }

    /**
     * Check if product exists
     */
    public async hasProduct(name: string): Promise<boolean> {
        const query = 'SELECT COUNT(*) as count FROM products WHERE name = ?';
        
        try {
            const [rows] = await this.pool.execute(query, [name]);
            return (rows as any[])[0].count > 0;
        } catch (error) {
            console.error(`  ✗ Failed to check product existence: ${error}`);
            throw error;
        }
    }

    /**
     * Delete a user
     */
    public async deleteUser(username: string): Promise<boolean> {
        const query = 'DELETE FROM users WHERE username = ?';
        
        try {
            const [result] = await this.pool.execute(query, [username]);
            const deleted = (result as any).affectedRows > 0;
            if (deleted) {
            }
            return deleted;
        } catch (error) {
            console.error(`  ✗ Failed to delete user: ${error}`);
            throw error;
        }
    }

    /**
     * Delete a product
     */
    public async deleteProduct(name: string): Promise<boolean> {
        const query = 'DELETE FROM products WHERE name = ?';
        
        try {
            const [result] = await this.pool.execute(query, [name]);
            const deleted = (result as any).affectedRows > 0;

            return deleted;
        } catch (error) {
            console.error(`  ✗ Failed to delete product: ${error}`);
            throw error;
        }
    }

    /**
     * Close database connection pool
     */
    public async closeConnection(): Promise<void> {
        try {
            await this.pool.end();
        } catch (error) {
            console.error(`  ✗ Failed to close connection: ${error}`);
            throw error;
        }
    }
}
