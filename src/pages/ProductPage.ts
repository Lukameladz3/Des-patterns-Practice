import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product } from '../patterns/builder/ProductBuilder';

/**
 * Product Page Object
 * 
 * Represents the product detail page on demoblaze.com
 */
export class ProductPage extends BasePage {
    // Locators
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly productDescription: Locator;
    readonly productImage: Locator;
    readonly productContentImage: Locator;
    readonly addToCartButton: Locator;

    constructor(page: Page) {
        super(page);
        this.productTitle = page.locator('.name');
        this.productPrice = page.locator('.price-container');
        this.productDescription = page.locator('#more-information');
        this.productImage = page.locator('img.img-fluid');
        this.productContentImage = page.locator('.product-content img');
        this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
    }

    /**
     * Get product title
     */
    async getProductTitle(): Promise<string> {
        return (await this.productTitle.textContent()) || '';
    }

    /**
     * Get product price
     */
    async getProductPrice(): Promise<number> {
        const priceText = (await this.productPrice.textContent()) || '';
        const match = priceText.match(/\$(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }

    /**
     * Get product description
     */
    async getProductDescription(): Promise<string> {
        return (await this.productDescription.textContent()) || '';
    }

    /**
     * Check if product image is visible
     */
    async isProductImageVisible(): Promise<boolean> {
        return await this.productImage.isVisible();
    }

    /**
     * Click Add to Cart button
     */
    async clickAddToCart(): Promise<void> {
        // Set up dialog handler before clicking
        const dialogPromise = new Promise<void>((resolve) => {
            this.page.once('dialog', async dialog => {
                await dialog.accept();
                resolve();
            });
        });

        await this.addToCartButton.click();
        
        // Wait for dialog to be handled
        await dialogPromise;
    }

    /**
     * Get complete product information
     */
    async getProductInfo(): Promise<Product> {
        return {
            name: await this.getProductTitle(),
            price: await this.getProductPrice(),
            description: await this.getProductDescription(),
        };
    }
}
