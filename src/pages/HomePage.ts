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

    // Product listing locators
    readonly productList: Locator;
    readonly productCards: Locator;
    readonly productTitles: Locator;

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

        this.productList = page.locator('#tbodyid');
        this.productCards = page.locator('.card');
        this.productTitles = page.locator('.card-title a');
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

    /**
     * Get the current count of visible products on the page.
     * Useful for assertions and verification in tests.
     * 
     * @returns Promise resolving to the number of visible product cards
     * 
     * @example
     * const count = await homePage.getProductCount();
     * expect(count).toBeGreaterThan(0);
     */
    async getProductCount(): Promise<number> {
        return await this.productCards.count();
    }

    /**
     * Wait for products to load and be visible in the UI.
     * This ensures the product list is ready for interaction or visual testing.
     * 
     * @param minProducts - Minimum number of products expected (default: 1)
     *                      Pass a specific count if you know the expected number for a category
     * 
     * @example
     * // Wait for at least 1 product (default)
     * await homePage.waitForProductsLoaded();
     * 
     * // Wait for specific count (e.g., 7 phones)
     * await homePage.waitForProductsLoaded(7);
     */
    async waitForProductsLoaded(minProducts: number = 1): Promise<void> {
        // Wait for at least the minimum number of product cards to be visible
        await this.productCards.nth(minProducts - 1).waitFor({ state: 'visible' });
        
        // Wait for product images to load (ensures visual stability)
        await this.productCardImages.first().waitFor({ state: 'visible' });
    }
}
