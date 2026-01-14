import { test, expect } from '../src/fixtures/pages.fixture';
import { getDatabaseManager } from '../src/patterns/singleton/DatabaseFactory';
import { UserBuilder } from '../src/patterns/builder/UserBuilder';
import { ProductBuilder } from '../src/patterns/builder/ProductBuilder';
import { SignUpFlow } from '../src/patterns/template/SignUpFlow';
import { LoginFlow } from '../src/patterns/template/LoginFlow';
import { PRODUCTS } from '../src/constants/TestConstants';
import { VISUAL_SNAPSHOTS, VIEWPORTS, VISUAL_PLACEHOLDERS, EXPECTED_PRODUCT_COUNTS } from '../src/constants/VisualConstants';
import { VisualTestHelper } from '../src/utils/VisualTestHelper';

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
        
        // Wait for products to load before counting them
        await homePage.waitForProductsLoaded(EXPECTED_PRODUCT_COUNTS.ALL);
        
        // Now get the count and verify
        const count = await homePage.getProductCount();
        expect(count).toBe(EXPECTED_PRODUCT_COUNTS.ALL);

        await VisualTestHelper.hideCarousel(page);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.HOMEPAGE.INITIAL, { fullPage: true });

        // Perform signup and login
        const signUpFlow = new SignUpFlow(page, user);
        await signUpFlow.execute();

        const loginFlow = new LoginFlow(page, user);
        await loginFlow.execute();

        // Verify login success
        await expect(homePage.usernameDisplay).toContainText(user.username);

        await VisualTestHelper.normalizeDynamicContent(page, VISUAL_PLACEHOLDERS.USERNAME);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.HOMEPAGE.LOGGED_IN, { fullPage: true });

        // Navigate to Monitors category
        await homePage.goToMonitors();
        
        // Wait for products to load using proper assertions
        await expect(homePage.productCardImages.first()).toBeVisible();

        // Click on the Apple monitor product
        await homePage.clickProduct(product.name);

        // Wait for product details to fully load
        await expect(productPage.productContentImage).toBeVisible();

        // Add product to cart
        await productPage.clickAddToCart();

        // Navigate to cart
        await homePage.clickCart();

        // Wait for cart to fully load
        await expect(cartPage.cartTable).toBeVisible();

        // Verify product is in cart
        await expect(cartPage.cartItems.filter({ hasText: product.name })).toBeVisible();

        await VisualTestHelper.normalizeDynamicContent(page, VISUAL_PLACEHOLDERS.USERNAME);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.CART.WITH_PRODUCT, { fullPage: true });

        // Assertions
        const itemCount = await cartPage.getItemCount();
        expect(
            itemCount,
            'Cart should contain exactly 1 item after adding the product'
        ).toBe(1);
    });

    test('Visual test: Product catalog comparison', async ({ page, homePage }) => {
        await homePage.goto();
        // Approach 1: Flexible - wait for at least 1 product (default)
        await homePage.waitForProductsLoaded();

        // Optional: Assert specific count if needed
        const allProductsCount = await homePage.getProductCount();
        expect(allProductsCount, 'All products should be loaded on homepage').toBe(EXPECTED_PRODUCT_COUNTS.ALL);

        await VisualTestHelper.hideCarousel(page);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.CATALOG.ALL, { fullPage: true });

        await homePage.goToLaptops();
        // Approach 2: Explicit - wait for specific expected count
        await homePage.waitForProductsLoaded(EXPECTED_PRODUCT_COUNTS.LAPTOPS);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.CATALOG.LAPTOPS, { fullPage: true });

        await homePage.goToMonitors();
        await homePage.waitForProductsLoaded(EXPECTED_PRODUCT_COUNTS.MONITORS);
        
        // Verify the count after loading
        const monitorsCount = await homePage.getProductCount();
        expect(monitorsCount, 'Monitors category should have expected count').toBe(EXPECTED_PRODUCT_COUNTS.MONITORS);
        
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.CATALOG.MONITORS, { fullPage: true });
    });

    test('Visual test: Responsive design validation', async ({ page, homePage }) => {
        await homePage.goto();
        await VisualTestHelper.hideCarousel(page);

        await page.setViewportSize(VIEWPORTS.DESKTOP);
        await VisualTestHelper.waitForViewportStability(page);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.RESPONSIVE.DESKTOP, { fullPage: true });

        await page.setViewportSize(VIEWPORTS.TABLET);
        await VisualTestHelper.waitForViewportStability(page);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.RESPONSIVE.TABLET, { fullPage: true });

        await page.setViewportSize(VIEWPORTS.MOBILE);
        await VisualTestHelper.waitForViewportStability(page);
        await expect.soft(page).toHaveScreenshot(VISUAL_SNAPSHOTS.RESPONSIVE.MOBILE, { fullPage: true });
    });
});
