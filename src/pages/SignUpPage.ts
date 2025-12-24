import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { User } from '../patterns/builder/UserBuilder';

/**
 * Sign Up Page Object
 * 
 * Represents the sign-up modal on demoblaze.com
 */
export class SignUpPage extends BasePage {
    // Locators
    readonly modal: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signUpButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.modal = page.locator('#signInModal');
        this.usernameInput = page.locator('#sign-username');
        this.passwordInput = page.locator('#sign-password');
        this.signUpButton = page.getByRole('button', { name: 'Sign up' });
        this.closeButton = this.modal.getByRole('button', { name: 'Close' });
    }

    /**
     * Fill sign-up form
     */
    async fillForm(user: User): Promise<void> {
        await this.usernameInput.fill(user.username);
        await this.passwordInput.fill(user.password);
    }

    /**
     * Click sign-up button
     */
    async clickSignUp(): Promise<void> {
        await this.signUpButton.click();
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
     * Complete sign-up process
     */
    async signUp(user: User): Promise<void> {
        await this.fillForm(user);
        await this.clickSignUp();
    }
}
