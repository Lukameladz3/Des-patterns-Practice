import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { User } from '../patterns/builder/UserBuilder';

/**
 * Login Page Object
 * 
 * Represents the login modal on demoblaze.com
 */
export class LoginPage extends BasePage {
    // Locators
    readonly modal: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.modal = page.locator('#logInModal');
        this.usernameInput = page.locator('#loginusername');
        this.passwordInput = page.locator('#loginpassword');
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        this.closeButton = this.modal.getByRole('button', { name: 'Close' });
    }

    /**
     * Fill login form
     */
    async fillForm(user: User): Promise<void> {
        await this.usernameInput.fill(user.username);
        await this.passwordInput.fill(user.password);
    }

    /**
     * Click login button
     */
    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }

    /**
     * Close the modal if it's open
     */
    async closeModal(): Promise<void> {
        if (await this.modal.isVisible()) {
            await this.closeButton.click();
        }
    }

    /**
     * Complete login process
     */
    async login(user: User): Promise<void> {
        await this.fillForm(user);
        await this.clickLogin();
    }
}
