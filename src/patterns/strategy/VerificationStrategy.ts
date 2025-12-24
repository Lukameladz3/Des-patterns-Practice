import { Page, expect } from '@playwright/test';
import { Product } from '../builder/ProductBuilder';

/**
 * Strategy Pattern Implementation - Product Verification
 * 
 * Purpose: Defines a family of verification algorithms and makes them interchangeable.
 * This allows the verification logic to vary independently from the clients that use it.
 * 
 * Benefits:
 * - Encapsulates different verification approaches
 * - Makes it easy to add new verification strategies
 * - Allows runtime selection of verification logic
 * - Follows Open/Closed Principle (open for extension, closed for modification)
 */

/**
 * Strategy interface that all verification strategies must implement.
 */
export interface VerificationStrategy {
    verify(page: Page, expectedProduct: Product): Promise<void>;
    getStrategyName(): string;
}

/**
 * Concrete Strategy 1: Verify only the product title
 * 
 * Use case: Quick smoke tests where only the product name needs verification
 */
export class TitleOnlyStrategy implements VerificationStrategy {
    public getStrategyName(): string {
        return 'Title Only Verification';
    }

    public async verify(page: Page, expectedProduct: Product): Promise<void> {
        console.log(`  → Using strategy: ${this.getStrategyName()}`);

        // Verify product title is visible and matches expected name
        const titleLocator = page.locator('.name');
        await expect(titleLocator).toBeVisible();
        await expect(titleLocator).toContainText(expectedProduct.name);

        console.log(`  ✓ Product title verified: ${expectedProduct.name}`);
    }
}

/**
 * Concrete Strategy 2: Verify product title and price
 * 
 * Use case: Standard verification for most test scenarios
 */
export class TitleAndPriceStrategy implements VerificationStrategy {
    public getStrategyName(): string {
        return 'Title and Price Verification';
    }

    public async verify(page: Page, expectedProduct: Product): Promise<void> {
        console.log(`  → Using strategy: ${this.getStrategyName()}`);

        // Verify product title
        const titleLocator = page.locator('.name');
        await expect(titleLocator).toBeVisible();
        await expect(titleLocator).toContainText(expectedProduct.name);
        console.log(`  ✓ Product title verified: ${expectedProduct.name}`);

        // Verify product price if provided
        if (expectedProduct.price !== undefined) {
            const priceLocator = page.locator('.price-container');
            await expect(priceLocator).toBeVisible();

            const priceText = await priceLocator.textContent();
            const priceMatch = priceText?.match(/\$(\d+)/);

            if (priceMatch) {
                const actualPrice = parseInt(priceMatch[1]);
                expect(actualPrice).toBe(expectedProduct.price);
                console.log(`  ✓ Product price verified: $${expectedProduct.price}`);
            }
        }
    }
}

/**
 * Concrete Strategy 3: Verify full product details
 * 
 * Use case: Comprehensive verification for critical test scenarios
 */
export class FullProductDetailsStrategy implements VerificationStrategy {
    public getStrategyName(): string {
        return 'Full Product Details Verification';
    }

    public async verify(page: Page, expectedProduct: Product): Promise<void> {
        console.log(`  → Using strategy: ${this.getStrategyName()}`);

        // Verify product title
        const titleLocator = page.locator('.name');
        await expect(titleLocator).toBeVisible();
        await expect(titleLocator).toContainText(expectedProduct.name);
        console.log(`  ✓ Product title verified: ${expectedProduct.name}`);

        // Verify product price
        if (expectedProduct.price !== undefined) {
            const priceLocator = page.locator('.price-container');
            await expect(priceLocator).toBeVisible();
            console.log(`  ✓ Product price verified`);
        }

        // Verify product description
        const descriptionLocator = page.locator('#more-information');
        await expect(descriptionLocator).toBeVisible();
        console.log(`  ✓ Product description is visible`);

        // Verify product image
        const imageLocator = page.locator('.product-image img, img.img-fluid');
        await expect(imageLocator).toBeVisible();
        console.log(`  ✓ Product image is visible`);

        // Verify "Add to cart" button is present
        const addToCartButton = page.locator('a.btn-success', { hasText: 'Add to cart' });
        await expect(addToCartButton).toBeVisible();
        console.log(`  ✓ Add to cart button is visible`);
    }
}

/**
 * Context class that uses a verification strategy.
 * This demonstrates how to use the Strategy pattern in practice.
 */
export class ProductVerifier {
    private strategy: VerificationStrategy;

    constructor(strategy: VerificationStrategy) {
        this.strategy = strategy;
    }

    /**
     * Allows changing the strategy at runtime.
     */
    public setStrategy(strategy: VerificationStrategy): void {
        this.strategy = strategy;
    }

    /**
     * Executes the verification using the current strategy.
     */
    public async verify(page: Page, expectedProduct: Product): Promise<void> {
        await this.strategy.verify(page, expectedProduct);
    }
}

/**
 * Example usage:
 * 
 * // Create product data
 * const product = ProductBuilder.appleMonitor().withPrice(400).build();
 * 
 * // Use title-only verification
 * const verifier1 = new ProductVerifier(new TitleOnlyStrategy());
 * await verifier1.verify(page, product);
 * 
 * // Switch to full details verification
 * verifier1.setStrategy(new FullProductDetailsStrategy());
 * await verifier1.verify(page, product);
 * 
 * // Or create with specific strategy
 * const verifier2 = new ProductVerifier(new TitleAndPriceStrategy());
 * await verifier2.verify(page, product);
 */
