import { IDatabaseManager } from './IDatabaseManager';
import { MockDatabaseManager } from './MockDatabaseManager';
import { DatabaseManager as MySQLDatabaseManager } from './DatabaseManager';

/**
 * Database Factory
 * 
 * Returns the appropriate database implementation based on environment:
 * - USE_MOCK_DB=true -> MockDatabaseManager (in-memory, no MySQL)
 * - USE_MOCK_DB=false or undefined -> MySQLDatabaseManager (real MySQL)
 * 
 * Usage in tests:
 * ```typescript
 * import { getDatabaseManager } from './DatabaseFactory';
 * 
 * const db = getDatabaseManager();
 * await db.saveUser(user);
 * ```
 */
export function getDatabaseManager(): IDatabaseManager {
    const useMockDB = process.env.USE_MOCK_DB === 'true';
    
    if (useMockDB) {
        return MockDatabaseManager.getInstance() as unknown as IDatabaseManager;
    }
    
    return MySQLDatabaseManager.getInstance() as unknown as IDatabaseManager;
}

export { IDatabaseManager } from './IDatabaseManager';
export { MockDatabaseManager } from './MockDatabaseManager';
export { DatabaseManager } from './DatabaseManager';
