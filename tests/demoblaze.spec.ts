import { test, expect } from '../src/fixtures/pages.fixture';
import { DatabaseManager } from '../src/patterns/singleton/DatabaseManager';
import { UserBuilder } from '../src/patterns/builder/UserBuilder';
import { ProductBuilder } from '../src/patterns/builder/ProductBuilder';
import {
    ProductVerifier,
    TitleOnlyStrategy,
    TitleAndPriceStrategy,
    FullProductDetailsStrategy
} from '../src/patterns/strategy/VerificationStrategy';
import { SignUpFlow } from '../src/patterns/template/SignUpFlow';
import { LoginFlow } from '../src/patterns/template/LoginFlow';
import {
    ClickCommand,
    NavigateCommand,
    WaitCommand
} from '../src/patterns/command/Command';
import { CommandExecutor } from '../src/patterns/command/CommandExecutor';
import { withLogging } from '../src/patterns/decorator/ActionDecorator';
import { PRODUCTS, SELECTORS, URLS } from '../src/constants/TestConstants';

test.describe('Design Patterns Demo - DemoBlaze E2E Test', () => {

    test('Complete user journey with all design patterns', async ({ page, homePage, productPage, cartPage }) => {
        console.log('\n📌 Pattern 1: SINGLETON - Database Manager');
        const db = DatabaseManager.getInstance();
        
        // Demonstrate singleton behavior - same instance
        const db2 = DatabaseManager.getInstance();
        expect(db.verifyInstanceIsSingleton(db, db2)).toBeTruthy();
        
        // Clear any previous test data
        await db.clearAll();

        const user = new UserBuilder()
            .withUsername()
            .withPassword()
            .build();

        await db.saveUser(user);

        const product = ProductBuilder.appleMonitor()
            .withPrice(PRODUCTS.APPLE_MONITOR.PRICE)
            .build();

        await db.saveProduct(product);  

        await db.saveTestData('testStartTime', new Date().toISOString());
        await db.saveTestData('testName', 'Complete user journey');

        await homePage.goto();

        const signUpFlow = new SignUpFlow(page, user);
        await signUpFlow.execute();

        const loginFlow = new LoginFlow(page, user);
        await loginFlow.execute();

        const retrievedUser = await db.getUser(user.username);
        expect(retrievedUser, 'User should be retrievable from database').toBeDefined();
        expect(retrievedUser?.username, 'Retrieved username should match').toBe(user.username);

        await expect(homePage.usernameDisplay).toContainText(user.username);

        const navigateToMonitors = withLogging(
            async () => await homePage.goToMonitors(),
            'Navigate to Monitors category'
        );
        await navigateToMonitors();

        // Demonstrate Command Pattern
        const commandExecutor = new CommandExecutor();
        // Use a more robust way to click the product within the command pattern
        commandExecutor
            .addCommand({
                execute: async () => { await homePage.clickProduct(product.name); },
                toString: () => `Click product: ${product.name}`
            } as any);

        await commandExecutor.executeAll();

        const verifier = new ProductVerifier(new TitleOnlyStrategy());
        await verifier.verify(page, product);

        verifier.setStrategy(new TitleAndPriceStrategy());
        await verifier.verify(page, product);

        verifier.setStrategy(new FullProductDetailsStrategy());
        await verifier.verify(page, product);

        // ProductPage.clickAddToCart() handles the dialog internally
        await productPage.clickAddToCart();

        await homePage.clickCart();
        
        // Assertions moved from Page Object to test level
        await expect(cartPage.cartItems.filter({ hasText: product.name })).toBeVisible();

        const itemCount = await cartPage.getItemCount();
        expect(
            itemCount,
            'Cart should contain exactly 1 item after adding the product'
        ).toBe(1);

        // Display database statistics
        await db.getStats();
        
        // Demonstrate data retrieval
        await db.getAllUsers();
        await db.getAllProducts();
    });

    test('Demonstrate Command Pattern with complex action sequence', async ({ page }) => {
        const executor = new CommandExecutor();

        executor
            .addCommand(new NavigateCommand(page, URLS.BASE_URL, 'Navigate to home'))
            .addCommand(new WaitCommand(page, SELECTORS.HOME_PAGE_INDICATOR, 'Wait for home page'))
            .addCommand(new ClickCommand(page, SELECTORS.LAPTOPS_CATEGORY, 'Select Laptops category'));

        await executor.executeAll();
        executor.printHistory();

        console.log('✓ Command pattern demo completed\n');
    });

    test('Demonstrate Builder Pattern variations', async () => {
        const user1 = UserBuilder.default().build();

        const user2 = new UserBuilder()
            .withUsername('testuser123')
            .withPassword('SecurePass123!')
            .withEmail('test@example.com')
            .build();

        const monitor = ProductBuilder.appleMonitor().withPrice(PRODUCTS.APPLE_MONITOR.PRICE).build();

        const laptop = ProductBuilder.custom('MacBook Pro')
            .withPrice(1299)
            .withCategory('Laptops')
            .build();
    });
});
