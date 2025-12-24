import { Page, expect } from '@playwright/test';
import { BaseFlow } from './BaseFlow';
import { User } from '../builder/UserBuilder';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { step } from '../../utils/StepDecorator';

/**
 * Concrete implementation of BaseFlow for Login flow.
 */
export class LoginFlow extends BaseFlow {
    private user: User;
    private loginPage: LoginPage;
    private homePage: HomePage;

    constructor(page: Page, user: User) {
        super(page, 'Login');
        this.user = user;
        this.loginPage = new LoginPage(page);
        this.homePage = new HomePage(page);
    }

    /**
     * Override: Perform login actions using Page Objects
     */
    @step('Login: Perform Actions')
    public async performActions(): Promise<void> {
        await this.homePage.clickLogin();
        await this.loginPage.login(this.user);
    }

    /**
     * Override: Verify login was successful
     */
    @step('Login: Verify')
    protected async verify(): Promise<void> {
        await expect(this.homePage.usernameDisplay).toContainText(this.user.username);
    }

    /**
     * Override: Custom cleanup for login flow
     */
    @step('Login: Cleanup')
    protected async cleanup(): Promise<void> {
        await this.loginPage.closeModal().catch(() => {});
    }
}
