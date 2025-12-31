import { test, expect } from '../src/fixtures/pages.fixture';
import { getDatabaseManager } from '../src/patterns/singleton/DatabaseFactory';
import { UserBuilder } from '../src/patterns/builder/UserBuilder';
import { ProductBuilder } from '../src/patterns/builder/ProductBuilder';
import { SignUpFlow } from '../src/patterns/template/SignUpFlow';
import { LoginFlow } from '../src/patterns/template/LoginFlow';
import { PRODUCTS } from '../src/constants/TestConstants';
import { VISUAL_SNAPSHOTS, VIEWPORTS, VISUAL_PLACEHOLDERS } from '../src/constants/VisualConstants';
import { Page } from '@playwright/test';

/**
 * Helper function to hide dynamic elements (carousel/slider) that cause flakiness
 */
async function hideCarousel(page: Page): Promise<void> {
    // Wait for carousel to be present before hiding it
    try {
        await page.waitForSelector('#carouselExampleIndicators, .carousel', { timeout: 2000 });
    } catch {
        // Carousel might not exist on all pages, that's okay
    }
    
    await page.addStyleTag({
        content: `
            #carouselExampleIndicators,
            .carousel,
            .carousel-inner {
                display: none !important;
            }
        `
    });
}

test.describe('Visual Testing - DemoBlaze E2E Journey', () => {

    test('Visual test: Complete user journey with 3 key screenshots', async ({ page, homePage, productPage, cartPage }) => {
        const db = getDatabaseManager();
        await db.clearAll();

        // Create test user
        const user = new UserBuilder()
            .withUsername()
            .withPassword()
            .build();

        await db.saveUser(user);

        // Create test product
        const product = ProductBuilder.appleMonitor()
            .withPrice(PRODUCTS.APPLE_MONITOR.PRICE)
            .build();

        await db.saveProduct(product);

        // Navigate to homepage
        await homePage.goto();

        // ==============================================
        // COMPARISON 1: Homepage after initial load
        // ==============================================
        // Hide carousel to prevent timing-related visual differences
        await hideCarousel(page);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.HOMEPAGE.INITIAL, { fullPage: true });

        // Perform signup and login
        const signUpFlow = new SignUpFlow(page, user);
        await signUpFlow.execute();

        const loginFlow = new LoginFlow(page, user);
        await loginFlow.execute();

        // Verify login success
        await expect.soft(homePage.usernameDisplay).toContainText(user.username);

        // ==============================================
        // COMPARISON 2: Homepage after successful login
        // ==============================================
        // Automatically compares to '02-homepage-logged-in.png'
        // Automatically compares to '02-homepage-logged-in.png'
        // Force the username text to be static for visual comparison
        await page.evaluate((placeholder) => {
            const userDisplay = document.querySelector('#nameofuser');
            if (userDisplay) userDisplay.textContent = placeholder;
        }, VISUAL_PLACEHOLDERS.USERNAME);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.HOMEPAGE.LOGGED_IN, { fullPage: true });

        // Navigate to Monitors category
        await homePage.goToMonitors();
        
        // Wait for products to load
        await expect(homePage.productCardImages.first()).toBeVisible();
        await page.waitForLoadState('domcontentloaded');

        // Click on the Apple monitor product
        await homePage.clickProduct(product.name);

        // Wait for product page to fully load
        // Wait for product details to fully load
        await expect(productPage.productContentImage).toBeVisible();
        await page.waitForLoadState('domcontentloaded');

        // Add product to cart
        await productPage.clickAddToCart();

        // Navigate to cart
        await homePage.clickCart();

        // Wait for cart to load
        // Wait for cart to fully load
        await expect(cartPage.cartTable).toBeVisible();
        await page.waitForLoadState('domcontentloaded');

        // Verify product is in cart
        await expect(cartPage.cartItems.filter({ hasText: product.name })).toBeVisible();

        // ==============================================
        // COMPARISON 3: Cart page with added product
        // ==============================================
        // Automatically compares to '03-cart-with-product.png'
        // Automatically compares to '03-cart-with-product.png'
        // Force the username text to be static for visual comparison
        await page.evaluate((placeholder) => {
            const userDisplay = document.querySelector('#nameofuser');
            if (userDisplay) userDisplay.textContent = placeholder;
        }, VISUAL_PLACEHOLDERS.USERNAME);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.CART.WITH_PRODUCT, { fullPage: true });

        // Assertions
        const itemCount = await cartPage.getItemCount();
        expect(
            itemCount,
            'Cart should contain exactly 1 item after adding the product'
        ).toBe(1);
    });

    test('Visual test: Product catalog comparison', async ({ page, homePage }) => {
        // Wait for initial product listing to load
        const initialProductsResponse = page.waitForResponse(resp => 
            (resp.url().includes('entries') || resp.url().includes('view')) && resp.status() === 200
        );
        await homePage.goto();
        await initialProductsResponse;
        await page.waitForTimeout(1000); // UI render buffer

        // ==============================================
        // COMPARISON 1: All products view
        // ==============================================
        await hideCarousel(page);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.CATALOG.ALL, { fullPage: true });

        // ==============================================
        // COMPARISON 2: Laptops category
        // ==============================================
        // Wait for 'bycat' API response to ensure Laptops are loaded
        const laptopsResponse = page.waitForResponse(resp => 
            resp.url().includes('bycat') && resp.status() === 200
        );
        await homePage.goToLaptops();
        await laptopsResponse;
        await page.waitForTimeout(1000); // UI render buffer
        
        await expect.soft(page).toHaveScreenshot('catalog-02-laptops.png', { fullPage: true });

        // ==============================================
        // COMPARISON 3: Monitors category
        // ==============================================
        // Wait for 'bycat' API response to ensure Monitors are loaded
        const monitorsResponse = page.waitForResponse(resp => 
            resp.url().includes('bycat') && resp.status() === 200
        );
        await homePage.goToMonitors();
        await monitorsResponse;
        await page.waitForTimeout(1000); // UI render buffer
        
        await expect.soft(page).toHaveScreenshot('catalog-03-monitors.png', { fullPage: true });
    });

    test('Visual test: Responsive design validation', async ({ page, homePage }) => {
        // This test captures the same page at different viewport sizes
        await homePage.goto();
        
        // Hide carousel to prevent flakiness
        await hideCarousel(page);

        // ==============================================
        // COMPARISON 1: Desktop view (1920x1080)
        // ==============================================
        await page.setViewportSize(VIEWPORTS.DESKTOP);
        // Wait for layout adjustments
        await page.waitForTimeout(200); // Small wait for resize repaint, networkidle might be too slow or never trigger if no requests
        
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.RESPONSIVE.DESKTOP, { fullPage: true });

        // ==============================================
        // COMPARISON 2: Tablet view (768x1024)
        // ==============================================
        // ==============================================
        // COMPARISON 2: Tablet view (768x1024)
        // ==============================================
        await page.setViewportSize(VIEWPORTS.TABLET);
        await page.waitForTimeout(200);
        
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.RESPONSIVE.TABLET, { fullPage: true });

        // ==============================================
        // COMPARISON 3: Mobile view (375x667)
        // ==============================================
        // ==============================================
        // COMPARISON 3: Mobile view (375x667)
        // ==============================================
        await page.setViewportSize(VIEWPORTS.MOBILE);
        await page.waitForTimeout(200);
        
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.RESPONSIVE.MOBILE, { fullPage: true });
    });
});
