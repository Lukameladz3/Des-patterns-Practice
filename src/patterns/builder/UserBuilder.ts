/**
 * Builder Pattern Implementation - User Data
 * 
 * Purpose: Provides a flexible and readable way to construct complex user objects
 * with optional fields using method chaining.
 * 
 * Benefits:
 * - Separates object construction from representation
 * - Allows step-by-step object creation
 * - Supports optional parameters elegantly
 * - Makes code more readable and maintainable
 */

export interface User {
    username: string;
    password: string;
    email?: string;
    firstName?: string;
    lastName?: string;
}

export class UserBuilder {
    private user: Partial<User> = {};

    /**
     * Sets the username. Generates a unique username if not provided.
     */
    public withUsername(username?: string): UserBuilder {
        this.user.username = username || this.generateUsername();
        return this;
    }

    /**
     * Sets the password. Generates a secure password if not provided.
     */
    public withPassword(password?: string): UserBuilder {
        this.user.password = password || this.generatePassword();
        return this;
    }

    /**
     * Sets the email address.
     */
    public withEmail(email: string): UserBuilder {
        this.user.email = email;
        return this;
    }

    /**
     * Sets the first name.
     */
    public withFirstName(firstName: string): UserBuilder {
        this.user.firstName = firstName;
        return this;
    }

    /**
     * Sets the last name.
     */
    public withLastName(lastName: string): UserBuilder {
        this.user.lastName = lastName;
        return this;
    }

    /**
     * Generates a unique username using timestamp and random string.
     */
    private generateUsername(): string {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 7);
        return `user_${timestamp}_${random}`;
    }

    /**
     * Generates a secure password with mixed characters.
     */
    private generatePassword(): string {
        const length = 12;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }

    /**
     * Builds and returns the final User object.
     * Ensures required fields are set.
     */
    public build(): User {
        // Ensure required fields are set
        if (!this.user.username) {
            this.user.username = this.generateUsername();
        }
        if (!this.user.password) {
            this.user.password = this.generatePassword();
        }

        return this.user as User;
    }

    /**
     * Static factory method for creating a builder with default values.
     */
    public static default(): UserBuilder {
        return new UserBuilder()
            .withUsername()
            .withPassword();
    }

    /**
     * Static factory method for creating a builder with custom credentials.
     */
    public static withCredentials(username: string, password: string): UserBuilder {
        return new UserBuilder()
            .withUsername(username)
            .withPassword(password);
    }
}

/**
 * Example usage:
 * 
 * // Create user with auto-generated credentials
 * const user1 = new UserBuilder().build();
 * 
 * // Create user with specific username and password
 * const user2 = new UserBuilder()
 *   .withUsername('testuser123')
 *   .withPassword('SecurePass123!')
 *   .build();
 * 
 * // Create user with all fields
 * const user3 = new UserBuilder()
 *   .withUsername('john_doe')
 *   .withPassword('MyPassword123')
 *   .withEmail('john@example.com')
 *   .withFirstName('John')
 *   .withLastName('Doe')
 *   .build();
 * 
 * // Using static factory methods
 * const user4 = UserBuilder.default().build();
 * const user5 = UserBuilder.withCredentials('admin', 'admin123').build();
 */
