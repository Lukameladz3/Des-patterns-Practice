import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Object
 * 
 * Represents the main home page of demoblaze.com
 */
export class HomePage extends BasePage {
    // Locators
    readonly signUpLink: Locator;
    readonly loginLink: Locator;
    readonly logoutLink: Locator;
    readonly usernameDisplay: Locator;
    readonly cartLink: Locator;
    readonly homeLink: Locator;

    // Category locators
    readonly phonesCategory: Locator;
    readonly laptopsCategory: Locator;
    readonly monitorsCategory: Locator;
    readonly productCardImages: Locator;

    constructor(page: Page) {
        super(page);
        this.signUpLink = page.locator('#signin2');
        this.loginLink = page.locator('#login2');
        this.logoutLink = page.locator('#logout2');
        this.usernameDisplay = page.locator('#nameofuser');
        this.cartLink = page.locator('#cartur');
        this.homeLink = page.getByRole('link', { name: 'Home' });

        this.phonesCategory = page.getByRole('link', { name: 'Phones' });
        this.laptopsCategory = page.getByRole('link', { name: 'Laptops' });
        this.monitorsCategory = page.getByRole('link', { name: 'Monitors' });
        this.productCardImages = page.locator('.card-img-top');
    }

    /**
     * Navigate to home page
     */
    async goto(): Promise<void> {
        await this.navigate('/index.html');
    }

    /**
     * Click on Sign Up link
     */
    async clickSignUp(): Promise<void> {
        await this.signUpLink.click();
    }

    /**
     * Click on Login link
     */
    async clickLogin(): Promise<void> {
        await this.loginLink.click();
    }

    /**
     * Click on Logout link
     */
    async clickLogout(): Promise<void> {
        await this.logoutLink.click();
    }

    /**
     * Click on Cart link
     */
    async clickCart(): Promise<void> {
        await this.cartLink.click();
    }

    /**
     * Get displayed username
     */
    async getDisplayedUsername(): Promise<string> {
        return (await this.usernameDisplay.textContent()) || '';
    }

    /**
     * Check if user is logged in
     */
    async isLoggedIn(): Promise<boolean> {
        return await this.usernameDisplay.isVisible();
    }

    /**
     * Navigate to Phones category
     */
    async goToPhones(): Promise<void> {
        await this.phonesCategory.click();
    }

    /**
     * Navigate to Laptops category
     */
    async goToLaptops(): Promise<void> {
        await this.laptopsCategory.click();
    }

    /**
     * Navigate to Monitors category
     */
    async goToMonitors(): Promise<void> {
        await this.monitorsCategory.click();
    }

    /**
     * Click on a product by name
     */
    async clickProduct(productName: string): Promise<void> {
        await this.page.getByRole('link', { name: productName }).click();
    }
}
