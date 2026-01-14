import { Page, expect } from '@playwright/test';
import { BaseFlow } from './BaseFlow';
import { Product } from '../builder/ProductBuilder';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { step } from '../../utils/StepDecorator';

/**
 * Concrete implementation of BaseFlow for Add to Cart flow.
 */
export class AddToCartFlow extends BaseFlow {
    private product: Product;
    private homePage: HomePage;
    private productPage: ProductPage;
    private cartPage: CartPage;

    constructor(page: Page, product: Product) {
        super(page, 'Add to Cart');
        this.product = product;
        this.homePage = new HomePage(page);
        this.productPage = new ProductPage(page);
        this.cartPage = new CartPage(page);
    }

    /**
     * Override: Setup - navigate to product category
     */
    @step('Add to Cart: Setup')
    protected async setup(): Promise<void> {
        if (this.product.category) {
            if (this.product.category === 'Monitors') {
                await this.homePage.goToMonitors();
            } else if (this.product.category === 'Laptops') {
                await this.homePage.goToLaptops();
            } else {
                await this.homePage.goToPhones();
            }
        }
    }

    /**
     * Override: Perform add to cart actions
     */
    @step('Add to Cart: Perform Actions')
    public async performActions(): Promise<void> {
        // Click on product in home page/category view
        await this.homePage.clickProduct(this.product.name);

        // Click Add to cart button
        await this.productPage.clickAddToCart();
    }

    /**
     * Override: Verify product was added to cart
     */
    @step('Add to Cart: Verify')
    protected async verify(): Promise<void> {
        // Navigate to cart
        await this.homePage.clickCart();

        // Verify product is in cart
        const productInCart = await this.cartPage.isProductInCart(this.product.name);
        expect(productInCart, `Product ${this.product.name} should be in cart`).toBeTruthy();
    }
}
