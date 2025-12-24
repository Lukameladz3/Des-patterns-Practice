import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart Page Object
 * 
 * Represents the shopping cart page on demoblaze.com
 */
export class CartPage extends BasePage {
    // Locators
    readonly cartTable: Locator;
    readonly cartItems: Locator;
    readonly totalPrice: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        super(page);
        this.cartTable = page.locator('#tbodyid');
        this.cartItems = page.locator('#tbodyid tr');
        this.totalPrice = page.locator('#totalp');
        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    }

    /**
     * Get all cart items
     */
    async getCartItems(): Promise<string[]> {
        const items = await this.cartItems.all();
        const itemNames: string[] = [];

        for (const item of items) {
            const nameCell = item.locator('td').nth(1);
            const name = await nameCell.textContent();
            if (name) {
                itemNames.push(name.trim());
            }
        }

        return itemNames;
    }

    /**
     * Get total price
     */
    async getTotalPrice(): Promise<number> {
        const priceText = (await this.totalPrice.textContent()) || '';
        return parseInt(priceText) || 0;
    }

    /**
     * Check if product is in cart
     */
    async isProductInCart(productName: string): Promise<boolean> {
        const productLocator = this.cartItems.locator('td', { hasText: productName });
        return await productLocator.isVisible();
    }

    /**
     * Get number of items in cart
     */
    async getItemCount(): Promise<number> {
        const items = await this.cartItems.all();
        return items.length;
    }

    /**
     * Click Place Order button
     */
    async clickPlaceOrder(): Promise<void> {
        await this.placeOrderButton.click();
    }

    /**
     * Delete item from cart by product name
     */
    async deleteItem(productName: string): Promise<void> {
        const deleteButton = this.cartItems
            .filter({ hasText: productName })
            .getByRole('link', { name: 'Delete' });
        await deleteButton.click();
        // Wait for item to be removed from cart
        await this.page.waitForLoadState('networkidle');
    }
}
